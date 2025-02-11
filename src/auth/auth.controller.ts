import { Body, Controller, Get, HttpException, HttpStatus, Inject, OnModuleInit, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccessTokenRequestDTO } from './dto/create-access-token-request.dto';
import { CreateAccessTokenResponseDTO } from './dto/create-access-token-response.dto';
import { RequireScope } from './decorators/require-scope.decorator';

@Controller()
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @RequireScope("none")
  @Post("oauth/token")
  async createAccessToken(@Body() dto: CreateAccessTokenRequestDTO): Promise<CreateAccessTokenResponseDTO> {
    return await this.authService.generateAccessToken(dto)
  }

}