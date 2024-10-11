import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common'
import { EventsService } from './events.service'
import { CreateEventRequestDTO } from './dto/create-event-request.dto'
import { CreateEventResponseDTO } from './dto/create-event-response.dto'
import { Request } from 'express'
import { IsPublic } from 'src/auth/decorators/public.decorator'
import { CheckScope } from 'src/auth/decorators/check-scope.decorator'
import { CheckProject } from 'src/auth/decorators/check-project.decorator'
import { ReadEventsResponseDTO } from './dto/read-events-response.dto'
import { ReadEventsRequestDTO } from './dto/read-events-request.dto'

@Controller("events")
export class EventsController {
  constructor(
    private readonly eventsService: EventsService
  ) { }

  @CheckScope("events:write")
  @CheckProject()
  @Post()
  async createEvent(@Body() dto: CreateEventRequestDTO, @Req() request: Request): Promise<CreateEventResponseDTO> {
    return await this.eventsService.createEvent(dto)
  }

  @CheckScope("events:read")
  @CheckProject()
  @Get()
  async getEvent(@Body() dto: ReadEventsRequestDTO, @Req() request: Request): Promise<ReadEventsResponseDTO> {
    return await this.eventsService.readEvents(dto)
  }

  @IsPublic()
  @Get()
  getHello(): string {
    return this.eventsService.getHello()
  }

}
