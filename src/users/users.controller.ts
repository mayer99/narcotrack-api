import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserRequestDTO } from './dto/create-user-request.dto';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { ReadUsersResponseDTO } from './dto/read-users-response.dto';
import { ReadUsersRequestDTO } from './dto/read-users-request.dto';
import { IsPublic } from 'src/auth/decorators/public.decorator';
import { CheckScope } from 'src/auth/decorators/check-scope.decorator';
import { Request } from 'express';
import { CheckUser } from 'src/auth/decorators/check-user.decorator';
import { AllowedSubjectTypes } from 'src/auth/decorators/allowed-subject-types.decorator';
import { SubjectType } from 'src/auth/subject-type.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @CheckScope("users:read")
  @AllowedSubjectTypes(SubjectType.SERVICE, SubjectType.USER)
  @Get()
  async readUsers(@Body() dto: ReadUsersRequestDTO, @Req() request: Request): Promise<ReadUsersResponseDTO> {
    return await this.usersService.readUsers(dto, request)
  }

  @CheckScope("users:create")
  @AllowedSubjectTypes(SubjectType.SERVICE, SubjectType.USER)
  @Post()
  async createUser(@Body() dto: CreateUserRequestDTO, @Req() request: Request): Promise<CreateUserResponseDTO> {
    return await this.usersService.createUser(dto, request)
  }

  @Get("hello")
  getHello(): string {
    return this.usersService.getHello();
  }
}
