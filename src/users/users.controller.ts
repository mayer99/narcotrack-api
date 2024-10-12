import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserRequestDTO } from './dto/create-user-request.dto';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { ReadUsersResponseDTO } from './dto/read-users-response.dto';
import { ReadUsersRequestDTO } from './dto/read-users-request.dto';
import { IsPublic } from 'src/auth/decorators/public.decorator';
import { CheckScope } from 'src/auth/decorators/check-scope.decorator';
import { Request } from 'express';
import { SubjectType } from 'src/auth/subject-type.enum';
import { CreateProjectRequestDTO } from './dto/create-project-request.dto';
import { CreateProjectResponseDTO } from './dto/create-project-response.dto';
import { ReadProjectsResponseDTO } from './dto/read-projects-response.dto';
import { ReadProjectsRequestDTO } from './dto/read-projects-request.dto';
import { CreateClientCredentialsRequestDTO } from 'src/auth/dto/create-client-credentials-request.dto';
import { CreateClientCredentialsResponseDTO } from 'src/auth/dto/create-client-credentials-response.dto';
import { AuthService } from 'src/auth/auth.service';
import { GetClientCredentialsRequestDTO } from 'src/auth/dto/get-client-credentials-request.dto';
import { GetClientCredentialsResponseDTO } from 'src/auth/dto/get-client-credentials-response.dto';
import { CheckSubjectType } from 'src/auth/decorators/check-subject-type.decorator';
import { CheckProject } from 'src/auth/decorators/check-project.decorator';
import { CheckUser } from 'src/auth/decorators/check-user.decorator.ts';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @CheckScope("users:read")
  @Get()
  async readUsers(@Body() dto: ReadUsersRequestDTO, @Req() request: Request): Promise<ReadUsersResponseDTO> {
    console.log("######")
    return await this.usersService.getUsers(dto)
  }

  @CheckScope("users:create")
  @Post()
  async createUser(@Body() dto: CreateUserRequestDTO, @Req() request: Request): Promise<CreateUserResponseDTO> {
    return await this.usersService.createUser(dto)
  }

  @CheckScope("users:projects:create")
  @CheckUser()
  @Post(':userId/projects')
  async createProject(
    @Param('userId') userId: string,
    @Body() dto: CreateProjectRequestDTO,
  ): Promise<CreateProjectResponseDTO> {
    return await this.usersService.createProject(userId, dto)
  }

  @CheckScope("users:projects:read")
  @CheckUser()
  @Get(':userId/projects')
  async getProjects(
    @Param('userId') userId: string,
    @Body() dto: ReadProjectsRequestDTO
  ): Promise<ReadProjectsResponseDTO> {
    return await this.usersService.getProjects(userId, dto);
  }

  @CheckScope("users:credentials:create")
  @CheckUser()
  @Post(':userId/credentials')
  async createClientCredentials(
    @Param('userId') userId: string,
    @Body() dto: CreateClientCredentialsRequestDTO,
  ): Promise<CreateClientCredentialsResponseDTO> {
    return await this.authService.createClientCredentials(dto, {
      type: SubjectType.USER,
      userId
    })
  }

  @CheckScope("users:credentials:read")
  @CheckUser()
  @Get(':userId/credentials')
  async getClientCredentials(
    @Param('userId') userId: string,
    @Body() dto: GetClientCredentialsRequestDTO
  ): Promise<GetClientCredentialsResponseDTO> {
    return await this.usersService.getClientCredentials(userId, dto)
  }

  @Get("hello")
  getHello(): string {
    return this.usersService.getHello();
  }
}
