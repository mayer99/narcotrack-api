import { BadRequestException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { CreateProjectRequestDTO } from './dto/create-project-request.dto';
import { CreateProjectResponseDTO } from './dto/create-project-response.dto';
import { User } from 'src/users/entities/user.entity';
import { randomBytes } from 'crypto';
import { ReadProjectsRequestDTO } from './dto/read-projects-request.dto';
import { ReadProjectsResponseDTO } from './dto/read-projects-response.dto';
import { Request } from 'express';

@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>
  ) { }

  async createProject(dto: CreateProjectRequestDTO, request: Request): Promise<CreateProjectResponseDTO> {
    const { name } = dto
    const userId = dto.user

    const user = await this.usersRepo.findOneBy({ externalId: userId })
    if (!user) throw new NotFoundException("Could not find user with this id")

    const externalId: string = randomBytes(32).toString('hex')
    if (await this.projectsRepo.exists({ where: { externalId } })) return await this.createProject(dto, request)

    const project = await this.projectsRepo.save({
      externalId,
      name,
      user
    })

    return {
      id: externalId,
      name,
      created_at: project.createdAt.getTime()
    }
  }

  async readProjects(dto: ReadProjectsRequestDTO, request: Request): Promise<ReadProjectsResponseDTO> {

    const userId = dto.user

    const projects = await this.projectsRepo.find({
      where: {
        user: {
          externalId: userId
        }
      },
      relations: {
        user: true
      }
    })

    if (!projects || projects.length === 0) throw new NotFoundException("Could not find any projects")

    return {
      projects: projects.map(project => {
        const { externalId, name, user, createdAt, updatedAt } = project
        return {
          id: externalId,
          name,
          user: user.externalId,
          created_at: createdAt.getTime(),
          updated_at: updatedAt.getTime()
        }
      })
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
