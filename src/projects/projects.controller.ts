import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { CreateLogResponseDTO } from './dto/create-log-response.dto'
import { CreateEventRequestDTO } from './dto/create-event-request.dto'
import { CreateEventResponseDTO } from './dto/create-event-response.dto'
import { ReadLogsResponseDTO } from './dto/read-logs-response.dto'
import { ReadLogsRequestDTO } from './dto/read-logs-request.dto'
import { ReadEventsRequestDTO } from './dto/read-events-request.dto'
import { ReadEventsResponseDTO } from './dto/read-events-response.dto'
import { AuthService } from 'src/auth/auth.service'
import { CreateClientCredentialsRequestDTO } from 'src/auth/dto/create-client-credentials-request.dto'
import { CreateClientCredentialsResponseDTO } from 'src/auth/dto/create-client-credentials-response.dto'
import { CreateLogRequestDTO } from './dto/create-log-request.dto'
import { GetClientCredentialsRequestDTO } from 'src/auth/dto/get-client-credentials-request.dto'
import { GetClientCredentialsResponseDTO } from 'src/auth/dto/get-client-credentials-response.dto'
import { ClientType } from 'src/auth/client-type.enum'
import { CheckScope } from 'src/auth/decorators/check-scope.decorator'
import { CheckProject } from 'src/auth/decorators/check-project.decorator'
import { Request } from 'express'
import { AccessControl } from 'src/auth/decorators/access-control.decorator'
import { AccessLevel } from 'src/auth/enum/access-level.enum'
import { ReadDevicesRequestDTO } from './dto/read-devices-request.dto'
import { ReadDevicesResponseDTO } from './dto/read-devices-response.dto'
import { CreateDeviceRequestDTO } from './dto/create-device-request.dto'
import { CreateDeviceResponseDTO } from './dto/create-device-response.dto'

@Controller("projects")
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService
  ) {}

  @CheckScope("logs:create")
  @CheckProject()
  @Post(':projectId/logs')
  async createLog(
    @Param('projectId') projectId: string,
    @Body() dto: CreateLogRequestDTO
  ): Promise<CreateLogResponseDTO> {
    return await this.projectsService.createLog(projectId, dto)
  }

  @CheckScope("logs:read")
  @CheckProject()
  @Get(':projectId/logs')
  async getLogs(
    @Param('projectId') projectId: string,
    @Body() dto: ReadLogsRequestDTO
  ): Promise<ReadLogsResponseDTO> {
    return await this.projectsService.getLogs(projectId, dto);
  }

  @CheckScope("events:create")
  @CheckProject()
  @Post(':projectId/events')
  async createEvent(
    @Param('projectId') projectId: string,
    @Body() dto: CreateEventRequestDTO
  ): Promise<CreateEventResponseDTO> {
    return await this.projectsService.createEvent(projectId, dto)
  }

  @CheckScope("events:read")
  @CheckProject()
  @Get(':projectId/events')
  async getEvents(
    @Param('projectId') projectId: string,
    @Body() dto: ReadEventsRequestDTO
  ): Promise<ReadEventsResponseDTO> {
    return await this.projectsService.getEvents(projectId, dto)
  }

  @CheckScope("devices:create")
  @CheckProject()
  @Post(':projectId/devices')
  async createClientCredentials(
    @Param('projectId') projectId: string,
    @Body() dto: CreateDeviceRequestDTO
  ): Promise<CreateDeviceResponseDTO> {
    return await this.projectsService.createDevice(projectId, dto)
  }

  @CheckScope("devices:read")
  @CheckProject()
  @Get(':projectId/devices')
  async getClientCredentials(
    @Param('projectId') projectId: string,
    @Body() dto: ReadDevicesRequestDTO
  ): Promise<ReadDevicesResponseDTO> {
    return await this.projectsService.getDevices(projectId, dto)
  }

  @AccessControl(AccessLevel.PUBLIC)
  @Get("hello")
  getHello(): string {
    return this.projectsService.getHello();
  }
}
