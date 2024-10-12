import { BadRequestException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { randomBytes } from 'crypto';
import { CreateLogRequestDTO } from './dto/create-log-request.dto';
import { CreateLogResponseDTO } from './dto/create-log-response.dto';
import { ReadLogsRequestDTO } from './dto/read-logs-request.dto';
import { CreateEventRequestDTO } from './dto/create-event-request.dto';
import { CreateEventResponseDTO } from './dto/create-event-response.dto';
import { ReadEventsRequestDTO } from './dto/read-events-request.dto';
import { ReadEventsResponseDTO } from './dto/read-events-response.dto';
import { ReadLogsResponseDTO } from './dto/read-logs-response.dto';
import { Log } from './entities/log.entity';
import { Event } from './entities/event.entity';
import { GetClientCredentialsRequestDTO } from 'src/auth/dto/get-client-credentials-request.dto';
import { GetClientCredentialsResponseDTO } from 'src/auth/dto/get-client-credentials-response.dto';
import { Request } from 'express';
import { AccessToken } from 'src/auth/entities/access_token.entity';

@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(Log)
    private readonly logsRepo: Repository<Log>,
    @InjectRepository(Event)
    private readonly eventsRepo: Repository<Event>,
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>
  ) { }

  async createLog(projectId: string, dto: CreateLogRequestDTO, request: Request): Promise<CreateLogResponseDTO> {

    let { messages, severity, device } = dto

    const project = await this.projectsRepo.findOneBy({ externalId: projectId })
    if (!project) throw new NotFoundException("Could not find project with this id")

    const accessToken: AccessToken = request["accessToken"]
    if (!accessToken) {
      throw new InternalServerErrorException("Could not find AccessToken")
    }

    const externalId: string = randomBytes(32).toString('hex')
    if (await this.logsRepo.exists({ where: { externalId } })) return await this.createLog(projectId, dto, request)

    await this.logsRepo.save({
      externalId,
      messages,
      severity,
      device,
      project,
      accessToken,
      clientCredentials: accessToken.clientCredentials,
      createdAt: new Date(dto.created_at)
    })

    return {
      message: `Log created`
    }
  }

  async getLogs(projectId: string, dto: ReadLogsRequestDTO): Promise<ReadLogsResponseDTO> {
    const project = await this.projectsRepo.findOne({
      where: {
        externalId: projectId
      },
      relations: {
        logs: {
          accessToken: true,
          clientCredentials: true
        }
      }
    })
    if (!project) throw new NotFoundException("Could not find project with this id")

    if (!project.logs || project.logs.length === 0) throw new NotFoundException("Could not find any logs")
    return {
      logs: project.logs.map(log => {
        const { externalId, messages, severity, device, clientCredentials, accessToken, createdAt, receivedAt } = log
        return {
          id: externalId,
          messages,
          severity,
          device,
          project: projectId,
          access_token: accessToken?.externalId,
          client_credentials: clientCredentials?.externalId,
          createdAt: createdAt.getTime(),
          receivedAt: receivedAt.getTime()
        }
      })
    }
  }

  async createEvent(projectId: string, dto: CreateEventRequestDTO, request: Request): Promise<CreateEventResponseDTO> {

    const { message, type, severity, device } = dto

    const project = await this.projectsRepo.findOneBy({ externalId: projectId })
    if (!project) throw new NotFoundException("Could not find project with this id")

    const accessToken: AccessToken = request["accessToken"]
    if (!accessToken) {
      throw new InternalServerErrorException("Could not find AccessToken")
    }

    const externalId: string = randomBytes(32).toString('hex')
    if (await this.eventsRepo.exists({ where: { externalId } })) return await this.createEvent(projectId, dto, request)

    await this.eventsRepo.save({
      externalId,
      message,
      type,
      severity,
      device,
      project,
      accessToken,
      clientCredentials: accessToken.clientCredentials,
      createdAt: new Date(dto.created_at)
    })

    return {
      message: "Event created"
    }
  }

  async getEvents(projectId: string, dto: ReadEventsRequestDTO): Promise<ReadEventsResponseDTO> {
    const project = await this.projectsRepo.findOne({
      where: {
        externalId: projectId
      },
      relations: {
        events: {
          accessToken: true,
          clientCredentials: true
        }
      }
    })
    if (!project) throw new NotFoundException("Could not find project with this id")

    if (!project.events || project.events.length === 0) throw new NotFoundException("Could not find events")
    return {
      events: project.events.map(event => {
        const { externalId, message, type, severity, device, accessToken, clientCredentials, createdAt, receivedAt } = event
        return {
          id: externalId,
          message,
          type,
          severity,
          device,
          project: projectId,
          access_token: accessToken?.externalId,
          client_credentials: clientCredentials?.externalId,
          createdAt: createdAt.getTime(),
          receivedAt: receivedAt.getTime()
        }
      })
    }
  }

  async getClientCredentials(projectId: string, dto: GetClientCredentialsRequestDTO): Promise<GetClientCredentialsResponseDTO> {

    const project = await this.projectsRepo.findOne({
      where: {
        externalId: projectId
      },
      relations: {
        clientCredentials: {
          accessTokens: true
        }
      }
    })
    if (!project) throw new NotFoundException("Could not find project with this id")

    if (!project.clientCredentials || project.clientCredentials.length === 0) throw new NotFoundException("Could not find any ClientCredentials")

    return {
      clientcredentials: project.clientCredentials.map(cc => {
        const { externalId, clientId, scopes, name, description, accessTokens, issuedAt } = cc
        return {
          id: externalId,
          client_id: clientId,
          scope: scopes.join(" "),
          name,
          description,
          access_tokens: accessTokens.map(accessToken => accessToken.externalId),
          issued_at: issuedAt.getTime()
        }
      })
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
