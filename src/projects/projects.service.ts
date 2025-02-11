import { BadRequestException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { createHash, randomBytes } from 'crypto';
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
import { Device } from './entities/device.entity';
import { CreateDeviceRequestDTO } from './dto/create-device-request.dto';
import { CreateDeviceResponseDTO } from './dto/create-device-response.dto';
import { ReadDevicesRequestDTO } from './dto/read-devices-request.dto';
import { ReadDevicesResponseDTO } from './dto/read-devices-response.dto';
import { ClientCredentials } from './entities/client_credentials.entity';
import { CreateClientCredentialsRequestDTO } from './dto/create-client-credentials-request.dto';
import { CreateClientCredentialsResponseDTO } from './dto/create-client-credentials-response.dto';

@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(Log)
    private readonly logsRepo: Repository<Log>,
    @InjectRepository(Event)
    private readonly eventsRepo: Repository<Event>,
    @InjectRepository(Device)
    private readonly devicesRepo: Repository<Device>,
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
    @InjectRepository(ClientCredentials)
    private readonly credentialsRepo: Repository<ClientCredentials>
  ) { }

  async createClientCredentials(projectId: string, dto: CreateClientCredentialsRequestDTO): Promise<CreateClientCredentialsResponseDTO> {
    const { name, description } = dto
    const deviceId = dto.device
    const scope = dto.scope.replace(/\s+/g, ' ').split(" ")

    const project = await this.projectsRepo.findOneBy({ externalId: projectId })
    if (!project) {
      throw new NotFoundException("Could not find project")
    }

    const device = await this.devicesRepo.findOne({
      where: {
        externalId: deviceId,
        project: {
          id: project.id
        }
      },
      relations: {
        project: {
          user: true
        }
      }
    })
    if (!device) {
      throw new NotFoundException("Device not found");
    }

    const clientId: string = randomBytes(32).toString('hex')
    if (await this.credentialsRepo.exists({ where: { clientId } })) return await this.createClientCredentials(projectId, dto)

    const clientSecret: string = randomBytes(32).toString('hex')
    const hashedClientSecret = createHash('sha256').update(clientSecret).digest().toString('hex')

    await this.credentialsRepo.save({
      clientId,
      hashedClientSecret,
      name,
      description,
      device,
      scope
    })

    return {
      client_id: clientId,
      client_secret: clientSecret,
      name,
      description,
      device: deviceId,
      scope
    }
  }

  async createDevice(projectId: string, dto: CreateDeviceRequestDTO): Promise<CreateDeviceResponseDTO> {

    let { name } = dto

    const project = await this.projectsRepo.findOneBy({ externalId: projectId })
    if (!project) {
      throw new NotFoundException("Could not find project")
    }

    const externalId: string = randomBytes(32).toString('hex')
    if (await this.devicesRepo.exists({ where: { externalId } })) return await this.createDevice(projectId, dto)

    await this.devicesRepo.save({
      externalId,
      name
    })

    return {
      id: externalId,
      name,
      project: projectId
    }
  }

  async createLog(projectId: string, dto: CreateLogRequestDTO): Promise<CreateLogResponseDTO> {

    const { message, severity } = dto
    const deviceId = dto.device
    const createdAt = dto.created_at

    const project = await this.projectsRepo.findOneBy({ externalId: projectId })
    if (!project) {
      throw new NotFoundException("Could not find project")
    }

    const device = await this.devicesRepo.findOneBy({
      externalId: deviceId,
      project: {
        id: project.id
      }
    })
    if (!device) {
      throw new NotFoundException("Could not find device as member of project")
    }

    const externalId: string = randomBytes(32).toString('hex')
    if (await this.logsRepo.exists({ where: { externalId } })) return await this.createLog(projectId, dto)

    await this.logsRepo.save({
      externalId,
      message,
      severity,
      device,
      project,
      createdAt: new Date(createdAt)
    })

    return {
      id: externalId,
      message,
      severity,
      device: deviceId,
      project: projectId
    }
  }

  async createEvent(projectId: string, dto: CreateEventRequestDTO): Promise<CreateEventResponseDTO> {

    const { message, type, severity } = dto
    const deviceId = dto.device
    const createdAt = dto.created_at

    const project = await this.projectsRepo.findOneBy({ externalId: projectId })
    if (!project) {
      throw new NotFoundException("Could not find project")
    }

    const device = await this.devicesRepo.findOneBy({
      externalId: deviceId,
      project: {
        id: project.id
      }
    })
    if (!device) {
      throw new NotFoundException("Could not find device as member of project")
    }

    const externalId: string = randomBytes(32).toString('hex')
    if (await this.eventsRepo.exists({ where: { externalId } })) return await this.createEvent(projectId, dto)

    await this.eventsRepo.save({
      externalId,
      message,
      type,
      severity,
      device,
      project,
      createdAt: new Date(createdAt)
    })

    return {
      id: externalId,
      message,
      type,
      severity,
      device: deviceId,
      project: projectId
    }
  }

  async getLogs(projectId: string, dto: ReadLogsRequestDTO): Promise<ReadLogsResponseDTO> {
    const project = await this.projectsRepo.findOne({
      where: {
        externalId: projectId
      },
      relations: {
        logs: {
          device: true
        }
      }
    })
    if (!project) throw new NotFoundException("Could not find project")

    if (!project.logs || project.logs.length === 0) throw new NotFoundException("Could not find any logs")

    return {
      data: project.logs.map(log => {
        const { externalId, message, severity, device, createdAt, receivedAt } = log
        return {
          id: externalId,
          message,
          severity,
          device: device.externalId,
          project: projectId,
          createdAt: createdAt.getTime(),
          receivedAt: receivedAt.getTime()
        }
      })
    }
  }

  async getDevices(projectId: string, dto: ReadDevicesRequestDTO): Promise<ReadDevicesResponseDTO> {
    const project = await this.projectsRepo.findOne({
      where: {
        externalId: projectId
      },
      relations: {
        devices: {
          clientCredentials: true
        }
      }
    })
    if (!project) throw new NotFoundException("Could not find project")

    if (!project.devices || project.devices.length === 0) throw new NotFoundException("Could not find any devices")

    return {
      data: project.devices.map(device => {
        const { externalId, name, clientCredentials, createdAt } = device
        return {
          id: externalId,
          name,
          project: projectId,
          client_credentials: clientCredentials.map(cc => cc.clientId),
          createdAt: createdAt.getTime()
        }
      })
    }
  }

  async getEvents(projectId: string, dto: ReadEventsRequestDTO): Promise<ReadEventsResponseDTO> {
    const project = await this.projectsRepo.findOne({
      where: {
        externalId: projectId
      },
      relations: {
        events: {
          device: true
        }
      }
    })
    if (!project) throw new NotFoundException("Could not find project with this id")

    if (!project.events || project.events.length === 0) throw new NotFoundException("Could not find events")

    return {
      data: project.events.map(event => {
        const { externalId, message, type, severity, device, createdAt, receivedAt } = event
        return {
          id: externalId,
          message,
          type,
          severity,
          device: device.externalId,
          project: projectId,
          createdAt: createdAt.getTime(),
          receivedAt: receivedAt.getTime()
        }
      })
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
