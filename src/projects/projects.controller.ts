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
import { SubjectType } from 'src/auth/subject-type.enum'
import { CheckScope } from 'src/auth/decorators/check-scope.decorator'
import { CheckProject } from 'src/auth/decorators/check-project.decorator'
import { Request } from 'express'

@Controller("projects")
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly authService: AuthService
  ) {}

  @CheckScope("projects:logs:create")
  @CheckProject()
  @Post(':projectId/logs')
  async createLog(
    @Param('projectId') projectId: string,
    @Body() dto: CreateLogRequestDTO,
    @Req() req: Request
  ): Promise<CreateLogResponseDTO> {
    return await this.projectsService.createLog(projectId, dto, req)
  }

  @CheckScope("projects:logs:read")
  @CheckProject()
  @Get(':projectId/logs')
  async getLogs(
    @Param('projectId') projectId: string,
    @Body() dto: ReadLogsRequestDTO
  ): Promise<ReadLogsResponseDTO> {
    return await this.projectsService.getLogs(projectId, dto);
  }

  @CheckScope("projects:events:create")
  @CheckProject()
  @Post(':projectId/events')
  async createEvent(
    @Param('projectId') projectId: string,
    @Body() dto: CreateEventRequestDTO,
    @Req() req: Request
  ): Promise<CreateEventResponseDTO> {
    return await this.projectsService.createEvent(projectId, dto, req)
  }

  @CheckScope("projects:events:read")
  @CheckProject()
  @Get(':projectId/events')
  async getEvents(
    @Param('projectId') projectId: string,
    @Body() dto: ReadEventsRequestDTO
  ): Promise<ReadEventsResponseDTO> {
    return await this.projectsService.getEvents(projectId, dto)
  }

  @CheckScope("projects:credentials:create")
  @CheckProject()
  @Post(':projectId/credentials')
  async createClientCredentials(
    @Param('projectId') projectId: string,
    @Body() dto: CreateClientCredentialsRequestDTO,
  ): Promise<CreateClientCredentialsResponseDTO> {
    return await this.authService.createClientCredentials(dto, {
      type: SubjectType.MACHINE,
      projectId
    })
  }

  @CheckScope("projects:credentials:read")
  @CheckProject()
  @Get(':projectId/credentials')
  async getClientCredentials(
    @Param('projectId') projectId: string,
    @Body() dto: GetClientCredentialsRequestDTO
  ): Promise<GetClientCredentialsResponseDTO> {
    return await this.projectsService.getClientCredentials(projectId, dto)
  }

  @Get("hello")
  getHello(): string {
    return this.projectsService.getHello();
  }
}
