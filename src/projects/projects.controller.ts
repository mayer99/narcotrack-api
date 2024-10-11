import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectRequestDTO } from './dto/create-project-request.dto';
import { CreateProjectResponseDTO } from './dto/create-project-response.dto';
import { ReadProjectsRequestDTO } from './dto/read-projects-request.dto';
import { ReadProjectsResponseDTO } from './dto/read-projects-response.dto';
import { IsPublic } from 'src/auth/decorators/public.decorator';
import { CheckScope } from 'src/auth/decorators/check-scope.decorator';
import { Request } from 'express';
import { CheckUser } from 'src/auth/decorators/check-user.decorator';
import { CheckProject } from 'src/auth/decorators/check-project.decorator';
import { AllowedSubjectTypes } from 'src/auth/decorators/allowed-subject-types.decorator';
import { SubjectType } from 'src/auth/subject-type.enum';

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @CheckScope("projects:create")
  @CheckUser()
  @AllowedSubjectTypes(SubjectType.SERVICE, SubjectType.USER)
  @Post()
  async createProject(@Body() dto: CreateProjectRequestDTO, @Req() req: Request): Promise<CreateProjectResponseDTO> {
    return await this.projectsService.createProject(dto,req)
  }

  @CheckScope("projects:read")
  @CheckUser()
  @AllowedSubjectTypes(SubjectType.SERVICE, SubjectType.USER)
  @Get()
  async readProjects(@Body() dto: ReadProjectsRequestDTO, @Req() req: Request): Promise<ReadProjectsResponseDTO> {
    return await this.projectsService.readProjects(dto, req)
  }

  @Get("hello")
  getHello(): string {
    return this.projectsService.getHello();
  }
}
