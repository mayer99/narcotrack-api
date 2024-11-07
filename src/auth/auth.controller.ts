import { Body, Controller, Get, HttpException, HttpStatus, Inject, OnModuleInit, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccessTokenRequestDTO } from './dto/create-access-token-request.dto';
import { CreateAccessTokenResponseDTO } from './dto/create-access-token-response.dto';
import { IsPublic } from './decorators/public.decorator';
import { CreateClientCredentialsRequestDTO } from './dto/create-client-credentials-request.dto';
import { CreateClientCredentialsResponseDTO } from './dto/create-client-credentials-response.dto';
import { CheckScope } from './decorators/check-scope.decorator';
import { Request } from 'express';
import { ClientType } from './client-type.enum';

@Controller("auth")
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @IsPublic()
  @Post("token")
  async createAccessToken(@Body() dto: CreateAccessTokenRequestDTO): Promise<CreateAccessTokenResponseDTO> {
    return await this.authService.createAccessToken(dto)
  }

  @CheckScope("credentials:create:service")
  @Post("credentials")
  async createClientCredentials(@Body() dto: CreateClientCredentialsRequestDTO): Promise<CreateClientCredentialsResponseDTO> {
    return await this.authService.createServiceCredentials(dto)
  }
 
}