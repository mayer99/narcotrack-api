import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { createHash, randomBytes } from 'crypto'
import { AccessToken } from './entities/access_token.entity'
import { ClientCredentials } from './entities/client_credentials.entity'
import { Repository } from 'typeorm'
import { Project } from 'src/projects/entities/project.entity'
import { CreateAccessTokenRequestDTO } from './dto/create-access-token-request.dto'
import { CreateAccessTokenResponseDTO } from './dto/create-access-token-response.dto'
import { CreateClientCredentialsRequestDTO } from './dto/create-client-credentials-request.dto'
import { CreateClientCredentialsResponseDTO } from './dto/create-client-credentials-response.dto'
import { User } from 'src/users/entities/user.entity'
import { ClientType } from './client-type.enum'

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(AccessToken)
        private readonly accessTokenRepo: Repository<AccessToken>,
        @InjectRepository(ClientCredentials)
        private readonly clientCredentialsRepo: Repository<ClientCredentials>,
        @InjectRepository(Project)
        private readonly projectsRepo: Repository<Project>,
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>
    ) { }

    async createAccessToken(dto: CreateAccessTokenRequestDTO): Promise<CreateAccessTokenResponseDTO> {
        const clientId = dto.client_id
        const clientSecret = dto.client_secret
        const grantType = dto.grant_type
        const scopes = dto.scope.replace(/\s+/g, ' ').split(" ")

        if (grantType !== "client_credentials") throw new BadRequestException("This endpoint only supports grant_type: client_credentials")

        const clientCredentials = await this.clientCredentialsRepo.findOneBy({ clientId })
        if (!clientCredentials) throw new NotFoundException("Invalid client_id")

        const hashedClientSecret = createHash('sha256').update(clientSecret).digest().toString('hex')
        if (hashedClientSecret !== clientCredentials.hashedClientSecret) throw new UnauthorizedException("Invalid client_secret")

        if (!scopes.every(scope => clientCredentials.scopes.includes(scope))) {
            throw new ForbiddenException("Requesting scopes that are not authorized")
        }

        const externalId: string = randomBytes(32).toString('hex')
        if (await this.accessTokenRepo.exists({ where: { externalId } })) return await this.createAccessToken(dto)

        const secret: string = randomBytes(32).toString('hex')
        const hashedSecret = createHash('sha256').update(secret).digest().toString('hex')
        if (await this.accessTokenRepo.exists({ where: { hashedSecret } })) return await this.createAccessToken(dto)

        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 1)

        await this.accessTokenRepo.save({
            externalId,
            hashedSecret,
            scopes,
            clientCredentials,
            type: clientCredentials.type,
            project: clientCredentials.project,
            user: clientCredentials.user,
            expiresAt
        })

        return {
            access_token: secret,
            expires_in: 86400,
            token_type: "Bearer",
            scope: scopes.join(" ")
        }
    }

    async getAccessTokenBySecret(secret: string): Promise<AccessToken> {
        return await this.accessTokenRepo.findOne({
            where: { hashedSecret: createHash('sha256').update(secret).digest().toString('hex') },
            relations: {
                project: true,
                user: {
                    projects: true
                },
                clientCredentials: true
            }
        })
    }

    private async createPartialClientCredentials(dto: CreateClientCredentialsRequestDTO): Promise<{ clientCredentials: Partial<ClientCredentials>, clientSecret: string }> {

        const { name, description, scope } = dto

        const externalId: string = randomBytes(32).toString('hex')
        if (await this.clientCredentialsRepo.exists({ where: { externalId } })) return await this.createPartialClientCredentials(dto)

        const clientId: string = randomBytes(32).toString('hex')
        if (await this.clientCredentialsRepo.exists({ where: { clientId } })) return await this.createPartialClientCredentials(dto)

        const clientSecret: string = randomBytes(32).toString('hex')
        const hashedClientSecret = createHash('sha256').update(clientSecret).digest().toString('hex')

        const scopes = scope.replace(/\s+/g, ' ').split(" ")

        return {
            clientCredentials: {
                externalId,
                clientId,
                hashedClientSecret,
                scopes,
                name,
                description
            },
            clientSecret
        }
    }

    async createMachineCredentials(dto: CreateClientCredentialsRequestDTO, projectId: string): Promise<CreateClientCredentialsResponseDTO> {
        if (!projectId) {
            throw new BadRequestException("No project defined")
        }
        const project = await this.projectsRepo.findOne({ where: { externalId: projectId } });
        if (!project) {
            throw new NotFoundException("Project not found");
        }
        let { clientCredentials, clientSecret } = await this.createPartialClientCredentials(dto)
        clientCredentials.project = project
        clientCredentials.type = ClientType.MACHINE
        await this.clientCredentialsRepo.save(clientCredentials)
        return {
            client_id: clientCredentials.clientId,
            client_secret: clientSecret,
            scope: clientCredentials.scopes.join(" ")
        }
    }

    async createUserCredentials(dto: CreateClientCredentialsRequestDTO, userId: string): Promise<CreateClientCredentialsResponseDTO> {
        if (!userId) {
            throw new BadRequestException("No user defined")
        }
        const user = await this.usersRepo.findOne({ where: { externalId: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        let { clientCredentials, clientSecret } = await this.createPartialClientCredentials(dto)
        clientCredentials.user = user
        clientCredentials.type = ClientType.USER
        await this.clientCredentialsRepo.save(clientCredentials)
        return {
            client_id: clientCredentials.clientId,
            client_secret: clientSecret,
            scope: clientCredentials.scopes.join(" ")
        }
    }

    async createServiceCredentials(dto: CreateClientCredentialsRequestDTO): Promise<CreateClientCredentialsResponseDTO> {
        let { clientCredentials, clientSecret } = await this.createPartialClientCredentials(dto)
        clientCredentials.type = ClientType.SERVICE
        await this.clientCredentialsRepo.save(clientCredentials)
        return {
            client_id: clientCredentials.clientId,
            client_secret: clientSecret,
            scope: clientCredentials.scopes.join(" ")
        }
    }

    getHello(): string {
        return "Hello World";
    }

}