import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Event } from './entities/event.entity'
import { Repository } from 'typeorm'
import { Project } from 'src/projects/entities/project.entity'
import { CreateEventRequestDTO } from './dto/create-event-request.dto'
import { CreateEventResponseDTO } from './dto/create-event-response.dto'
import { Request } from 'express'
import { AccessToken } from 'src/auth/entities/access_token.entity'
import { randomBytes } from 'crypto'
import { ReadEventsRequestDTO } from './dto/read-events-request.dto'
import { ReadEventsResponseDTO } from './dto/read-events-response.dto'

@Injectable()
export class EventsService {

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepo: Repository<Event>,
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>
  ) { }

  async createEvent(dto: CreateEventRequestDTO): Promise<CreateEventResponseDTO> {

    const { message, type, severity, device } = dto

    const project = await this.projectsRepo.findOneBy({ externalId: dto.project })
    if (!project) throw new NotFoundException("Could not find project with this id")

    const externalId: string = randomBytes(32).toString('hex')
    if (await this.eventsRepo.exists({ where: { externalId } })) return await this.createEvent(dto)

    await this.eventsRepo.save({
      externalId,
      message,
      type,
      severity,
      device,
      project,
      createdAt: new Date(dto.created_at)
    })

    return {
      message: "Event created"
    }
  }

  async readEvents(dto: ReadEventsRequestDTO): Promise<ReadEventsResponseDTO> {
    const projectId = dto.project
    const events = await this.eventsRepo.find({
      where: {
        project: {
          externalId: projectId
        }
      },
      relations: { project: true }
    })
    if (!events || events.length === 0) throw new NotFoundException("Could not find events")
    return {
      events: events.map(event => {
        const { externalId, message, type, severity, device, project, createdAt, receivedAt } = event
        return {
          id: externalId,
          message,
          type,
          severity,
          device,
          project: project.externalId,
          createdAt: createdAt.getTime(),
          receivedAt: receivedAt.getTime()
        }
      })
    }
  }

  getHello(): string {
    return "Hello World"
  }

}
