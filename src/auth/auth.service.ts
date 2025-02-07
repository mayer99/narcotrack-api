import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { createHash, randomBytes } from 'crypto'
import { ClientCredentials } from './entities/client_credentials.entity'
import { Repository } from 'typeorm'
import { CreateAccessTokenRequestDTO as GenerateAccessTokenRequestDTO } from './dto/create-access-token-request.dto'
import { CreateAccessTokenResponseDTO as GenerateAccessTokenResponseDTO } from './dto/create-access-token-response.dto'
import { CreateClientCredentialsRequestDTO } from './dto/create-client-credentials-request.dto'
import { CreateClientCredentialsResponseDTO } from './dto/create-client-credentials-response.dto'
import { User } from 'src/users/entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import { Device } from 'src/projects/entities/device.entity'

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(ClientCredentials)
        private readonly clientCredentialsRepo: Repository<ClientCredentials>,
        @InjectRepository(Device)
        private readonly devicesRepo: Repository<Device>,
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
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

    async createClientCredentials(dto: CreateClientCredentialsRequestDTO): Promise<CreateClientCredentialsResponseDTO> {

        const { name, description } = dto
        const deviceId = dto.device
        const scope = dto.scope.replace(/\s+/g, ' ')

        const device = await this.devicesRepo.findOne({ where: { externalId: deviceId } });
        if (!device) {
            throw new NotFoundException("Device not found");
        }

        const clientId: string = randomBytes(32).toString('hex')
        if (await this.clientCredentialsRepo.exists({ where: { clientId } })) return await this.createClientCredentials(dto)

        const clientSecret: string = randomBytes(32).toString('hex')
        const hashedClientSecret = createHash('sha256').update(clientSecret).digest().toString('hex')

        await this.clientCredentialsRepo.save({
            clientId,
            hashedClientSecret,
            name,
            description,
            device,
            scope
        })
        return {
            client_id: clientId,
            client_secret: clientSecret,
            name,
            description,
            device: deviceId,
            scope
        }
    }

    getHello(): string {
        return "Hello World";
    }

}