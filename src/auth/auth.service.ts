import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { createHash } from 'crypto'
import { ClientCredentials } from '../projects/entities/client_credentials.entity'
import { Repository } from 'typeorm'
import { CreateAccessTokenRequestDTO as GenerateAccessTokenRequestDTO } from './dto/create-access-token-request.dto'
import { CreateAccessTokenResponseDTO as GenerateAccessTokenResponseDTO } from './dto/create-access-token-response.dto'
import { JwtService } from '@nestjs/jwt'
import { Device } from 'src/projects/entities/device.entity'

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(ClientCredentials)
        private readonly clientCredentialsRepo: Repository<ClientCredentials>,
        private readonly jwtService: JwtService
    ) { }

    async generateAccessToken(dto: GenerateAccessTokenRequestDTO): Promise<GenerateAccessTokenResponseDTO> {

        const clientId = dto.client_id
        const clientSecret = dto.client_secret
        const grantType = dto.grant_type
        const audience = dto.audience

        const clientCredentials = await this.clientCredentialsRepo.findOneBy({ clientId })
        if (!clientCredentials) throw new NotFoundException("Invalid client_id")

        const hashedClientSecret = createHash('sha256').update(clientSecret).digest().toString('hex')
        if (hashedClientSecret !== clientCredentials.hashedClientSecret) throw new UnauthorizedException("Invalid client_secret")

        const payload = {
            sub: clientId,
            scope: clientCredentials.scope
        }

        return {
            token_type: "Bearer",
            expires_in: 3 * 24 * 60 * 60,
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    getHello(): string {
        return "Hello World";
    }

}