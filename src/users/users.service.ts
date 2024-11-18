import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { CreateUserRequestDTO } from './dto/create-user-request.dto'
import { CreateUserResponseDTO } from './dto/create-user-response.dto'
import { randomBytes } from 'crypto'
import { ReadUsersRequestDTO } from './dto/read-users-request.dto'
import { ReadUsersResponseDTO } from './dto/read-users-response.dto'
import { CreateProjectRequestDTO } from './dto/create-project-request.dto'
import { CreateProjectResponseDTO } from './dto/create-project-response.dto'
import { Project } from 'src/projects/entities/project.entity'
import { ReadProjectsRequestDTO } from './dto/read-projects-request.dto'
import { ReadProjectsResponseDTO } from './dto/read-projects-response.dto'
import { GetClientCredentialsRequestDTO } from 'src/auth/dto/get-client-credentials-request.dto'
import { GetClientCredentialsResponseDTO } from 'src/auth/dto/get-client-credentials-response.dto'

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>
  ) { }

  async createProject(userId: string, dto: CreateProjectRequestDTO): Promise<CreateProjectResponseDTO> {
    const { name } = dto

    const user = await this.usersRepo.findOneBy({ externalId: userId })
    if (!user) {
      throw new NotFoundException("Could not find user")
    }

    const externalId: string = randomBytes(32).toString('hex')
    if (await this.projectsRepo.exists({ where: { externalId } })) return await this.createProject(userId, dto)

    const project = await this.projectsRepo.save({
      externalId,
      name,
      user
    })

    return {
      id: externalId,
      name
    }
  }

  async getProjects(userId: string, dto: ReadProjectsRequestDTO): Promise<ReadProjectsResponseDTO> {

    const user = await this.usersRepo.findOne({
      where: {
        externalId: userId
      },
      relations: {
        projects: true
      }
    })
    if (!user) {
      throw new NotFoundException("Could not find user")
    }

    if (!user.projects || user.projects.length === 0) throw new NotFoundException("Could not find any projects")

    return {
      projects: user.projects.map(project => {
        const { externalId, name, createdAt, updatedAt } = project
        return {
          id: externalId,
          name,
          created_at: createdAt.getTime(),
          updated_at: updatedAt.getTime()
        }
      })
    }
  }

  async getClientCredentials(userId: string, dto: GetClientCredentialsRequestDTO): Promise<GetClientCredentialsResponseDTO> {

    const user = await this.usersRepo.findOne({
      where: {
        externalId: userId
      },
      relations: {
        clientCredentials: true
      }
    })
    if (!user) {
      throw new NotFoundException("Could not find user")
    }

    if (!user.clientCredentials || user.clientCredentials.length === 0) throw new NotFoundException("Could not find any ClientCredentials")

    return {
      client_credentials: user.clientCredentials.map(clientCredentials => {
        const { externalId, clientId, scopes, name, description, issuedAt } = clientCredentials
        return {
          id: externalId,
          client_id: clientId,
          scope: scopes.join(" "),
          name,
          description,
          issued_at: issuedAt.getTime()
        }
      })
    }
  }

  async createUser(dto: CreateUserRequestDTO): Promise<CreateUserResponseDTO> {
    const { name } = dto

    const externalId: string = randomBytes(32).toString('hex')
    if (await this.usersRepo.exists({ where: { externalId } })) return await this.createUser(dto)

    const user = await this.usersRepo.save({
      externalId,
      name
    })

    return {
      id: externalId,
      name,
    }
  }

  async getUsers(dto: ReadUsersRequestDTO): Promise<ReadUsersResponseDTO> {
    const users = await this.usersRepo.find({
      where: {}
    })

    if (!users || users.length === 0) throw new NotFoundException("Could not find any users")
    return {
      users: users.map(user => {
        const { externalId, name, projects, accessTokens, clientCredentials, createdAt, updatedAt } = user
        return {
          id: externalId,
          name,
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
