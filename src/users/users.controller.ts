import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserRequestDTO } from './dto/create-user-request.dto';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { ReadUsersResponseDTO } from './dto/read-users-response.dto';
import { ReadUsersRequestDTO } from './dto/read-users-request.dto';
import { RequireScope } from 'src/auth/decorators/require-scope.decorator';
import { CreateProjectRequestDTO } from './dto/create-project-request.dto';
import { CreateProjectResponseDTO } from './dto/create-project-response.dto';
import { ReadProjectsResponseDTO } from './dto/read-projects-response.dto';
import { ReadProjectsRequestDTO } from './dto/read-projects-request.dto';
import { RequireUser } from 'src/auth/decorators/require-user.decorator.ts';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @RequireScope("users:read")
  @Get()
  async readUsers(@Body() dto: ReadUsersRequestDTO): Promise<ReadUsersResponseDTO> {
    return await this.usersService.getUsers(dto)
  }

  @RequireScope("users:create")
  @Post()
  async createUser(@Body() dto: CreateUserRequestDTO): Promise<CreateUserResponseDTO> {
    return await this.usersService.createUser(dto)
  }

  @RequireScope("projects:create")
  @RequireUser()
  @Post(':userId/projects')
  async createProject(
    @Param('userId') userId: string,
    @Body() dto: CreateProjectRequestDTO,
  ): Promise<CreateProjectResponseDTO> {
    return await this.usersService.createProject(userId, dto)
  }

  @RequireScope("projects:read")
  @RequireUser()
  @Get(':userId/projects')
  async getProjects(
    @Param('userId') userId: string,
    @Body() dto: ReadProjectsRequestDTO
  ): Promise<ReadProjectsResponseDTO> {
    return await this.usersService.getProjects(userId, dto);
  }

  @RequireScope("none")
  @Get("hello")
  getHello(): string {
    return this.usersService.getHello();
  }
}
