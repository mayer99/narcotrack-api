import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { CreateUserRequestDTO } from './dto/create-user-request.dto';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { randomBytes } from 'crypto';
import { ReadUsersRequestDTO } from './dto/read-users-request.dto';
import { ReadUsersResponseDTO } from './dto/read-users-response.dto';
import { Request } from 'express';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>
  ) { }

  async createUser(dto: CreateUserRequestDTO, request: Request): Promise<CreateUserResponseDTO> {
    const { name } = dto

    const externalId: string = randomBytes(32).toString('hex')
    if (await this.usersRepo.exists({ where: { externalId } })) return await this.createUser(dto, request)

    const user = await this.usersRepo.save({
      externalId,
      name
    })

    return {
      id: externalId,
      name,
      created_at: user.createdAt.getTime()
    }
  }

  async readUsers(dto: ReadUsersRequestDTO, request: Request): Promise<ReadUsersResponseDTO> {
    const users = await this.usersRepo.find({
      where: {},
      relations: {
        projects: true
      }
    })

    if (!users || users.length === 0) throw new NotFoundException("Could not find any users")

    return {
      users: users.map(user => {
        const { externalId, name, projects, createdAt, updatedAt } = user
        return {
          id: externalId,
          name,
          projects: projects.map(project => project.externalId),
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
