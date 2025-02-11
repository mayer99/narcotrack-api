import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { CreateLogResponseDTO } from './dto/create-log-response.dto'
import { CreateEventRequestDTO } from './dto/create-event-request.dto'
import { CreateEventResponseDTO } from './dto/create-event-response.dto'
import { ReadLogsResponseDTO } from './dto/read-logs-response.dto'
import { ReadLogsRequestDTO } from './dto/read-logs-request.dto'
import { ReadEventsRequestDTO } from './dto/read-events-request.dto'
import { ReadEventsResponseDTO } from './dto/read-events-response.dto'
import { CreateClientCredentialsRequestDTO } from 'src/projects/dto/create-client-credentials-request.dto'
import { CreateClientCredentialsResponseDTO } from 'src/projects/dto/create-client-credentials-response.dto'
import { CreateLogRequestDTO } from './dto/create-log-request.dto'
import { ReadDevicesRequestDTO } from './dto/read-devices-request.dto'
import { ReadDevicesResponseDTO } from './dto/read-devices-response.dto'
import { CreateDeviceRequestDTO } from './dto/create-device-request.dto'
import { CreateDeviceResponseDTO } from './dto/create-device-response.dto'
import { RequireScope } from 'src/auth/decorators/require-scope.decorator'

@Controller("projects")
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService
  ) {}

  @RequireScope("logs:create")
  @Post(':projectId/logs')
  async createLog(
    @Param('projectId') projectId: string,
    @Body() dto: CreateLogRequestDTO
  ): Promise<CreateLogResponseDTO> {
    return await this.projectsService.createLog(projectId, dto)
  }

  @RequireScope("logs:read")
  @Get(':projectId/logs')
  async getLogs(
    @Param('projectId') projectId: string,
    @Body() dto: ReadLogsRequestDTO
  ): Promise<ReadLogsResponseDTO> {
    return await this.projectsService.getLogs(projectId, dto);
  }

  @RequireScope("events:create")
  @Post(':projectId/events')
  async createEvent(
    @Param('projectId') projectId: string,
    @Body() dto: CreateEventRequestDTO
  ): Promise<CreateEventResponseDTO> {
    return await this.projectsService.createEvent(projectId, dto)
  }

  @RequireScope("events:read")
  @Get(':projectId/events')
  async getEvents(
    @Param('projectId') projectId: string,
    @Body() dto: ReadEventsRequestDTO
  ): Promise<ReadEventsResponseDTO> {
    return await this.projectsService.getEvents(projectId, dto)
  }

  @RequireScope("devices:create")
  @Post(':projectId/devices')
  async createDevice(
    @Param('projectId') projectId: string,
    @Body() dto: CreateDeviceRequestDTO
  ): Promise<CreateDeviceResponseDTO> {
    return await this.projectsService.createDevice(projectId, dto)
  }

  @RequireScope("devices:read")
  @Get(':projectId/devices')
  async getDevices(
    @Param('projectId') projectId: string,
    @Body() dto: ReadDevicesRequestDTO
  ): Promise<ReadDevicesResponseDTO> {
    return await this.projectsService.getDevices(projectId, dto)
  }

  @RequireScope("credentials:create")
  @Post(':projectId/credentials')
  async createCredentials(
    @Param('projectId') projectId: string,
    @Body() dto: CreateClientCredentialsRequestDTO
  ): Promise<CreateClientCredentialsResponseDTO> {
    return await this.projectsService.createClientCredentials(projectId, dto)
  }

  @RequireScope("none")
  @Get("hello")
  getHello(): string {
    return this.projectsService.getHello();
  }
}
