import { Body, Controller, Get, HttpException, HttpStatus, Inject, OnModuleInit, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccessTokenRequestDTO } from './dto/create-access-token-request.dto';
import { CreateAccessTokenResponseDTO } from './dto/create-access-token-response.dto';
import { CreateClientCredentialsRequestDTO } from './dto/create-client-credentials-request.dto';
import { CreateClientCredentialsResponseDTO } from './dto/create-client-credentials-response.dto';
import { AccessControl } from './decorators/access-control.decorator';
import { AccessLevel } from './enum/access-level.enum';

@Controller()
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @AccessControl(AccessLevel.PUBLIC)
  @Post("oauth/token")
  async createAccessToken(@Body() dto: CreateAccessTokenRequestDTO): Promise<CreateAccessTokenResponseDTO> {
    return await this.authService.generateAccessToken(dto)
  }

  @AccessControl(AccessLevel.DEVELOPMENT)
  @Post("oauth/client/register")
  async createClientCredentials(@Body() dto: CreateClientCredentialsRequestDTO): Promise<CreateClientCredentialsResponseDTO> {
    return await this.authService.createClientCredentials(dto)
  }
 
}