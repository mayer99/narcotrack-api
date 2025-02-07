import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserRequestDTO } from './dto/create-user-request.dto';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { ReadUsersResponseDTO } from './dto/read-users-response.dto';
import { ReadUsersRequestDTO } from './dto/read-users-request.dto';
import { CheckScope } from 'src/auth/decorators/check-scope.decorator';
import { Request } from 'express';
import { CreateProjectRequestDTO } from './dto/create-project-request.dto';
import { CreateProjectResponseDTO } from './dto/create-project-response.dto';
import { ReadProjectsResponseDTO } from './dto/read-projects-response.dto';
import { ReadProjectsRequestDTO } from './dto/read-projects-request.dto';
import { AuthService } from 'src/auth/auth.service';
import { CheckUser } from 'src/auth/decorators/check-user.decorator.ts';
import { AccessControl } from 'src/auth/decorators/access-control.decorator';
import { AccessLevel } from 'src/auth/enum/access-level.enum';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @CheckScope("users:read")
  @Get()
  async readUsers(@Body() dto: ReadUsersRequestDTO): Promise<ReadUsersResponseDTO> {
    return await this.usersService.getUsers(dto)
  }

  @CheckScope("users:create")
  @Post()
  async createUser(@Body() dto: CreateUserRequestDTO): Promise<CreateUserResponseDTO> {
    return await this.usersService.createUser(dto)
  }

  @CheckScope("projects:create")
  @CheckUser()
  @Post(':userId/projects')
  async createProject(
    @Param('userId') userId: string,
    @Body() dto: CreateProjectRequestDTO,
  ): Promise<CreateProjectResponseDTO> {
    return await this.usersService.createProject(userId, dto)
  }

  @CheckScope("projects:read")
  @CheckUser()
  @Get(':userId/projects')
  async getProjects(
    @Param('userId') userId: string,
    @Body() dto: ReadProjectsRequestDTO
  ): Promise<ReadProjectsResponseDTO> {
    return await this.usersService.getProjects(userId, dto);
  }

  @Get("hello")
  getHello(): string {
    return this.usersService.getHello();
  }
}
