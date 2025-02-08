import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { REQUIRED_SCOPE_KEY } from './decorators/check-scope.decorator';
import { TokenPayload } from './interfaces/token-payload.interface';
import { CHECK_PROJECT_KEY } from './decorators/check-project.decorator';




@Injectable()
export class SimplerGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly jwtService: JwtService,
        @InjectRepository(Project)
        private readonly projectsRepo: Repository<Project>,
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredScope = this.reflector.get<string>(REQUIRED_SCOPE_KEY, context.getHandler())
        if (!requiredScope) {
            throw new InternalServerErrorException("RequiredScope for this endpoint is not defined")
        }

        const request = context.switchToHttp().getRequest<Request>()
        const authorizationHeader = request.headers['authorization']
        if (!authorizationHeader) {
            throw new UnauthorizedException('AuthorizationHeader missing')
        }

        const [type, accessToken] = authorizationHeader.split(' ')

        if (type !== "Bearer") {
            throw new BadRequestException('Invalid type of token')
        }

        if (!accessToken) {
            throw new BadRequestException('No AccessToken provided')
        }

        try {
            const payload: TokenPayload = await this.jwtService.verifyAsync(accessToken)

            const projectId = request.params['projectId'];
            if (!projectId) {
                throw new BadRequestException("You need to provide a project id to access this resource")
            }

            switch (payload.type) {
                case TokenType.DEVICE:
                    if (projectId !== payload.project) {
                        throw new ForbiddenException("Cannot access this project")
                    }
                    break
                case TokenType.USER:
                    const project = await this.projectsRepo.findOneBy({ externalId: projectId })
                    if (!project) {
                        throw new NotFoundException("Could not find project with this id")
                    }
                    const user = await this.usersRepo.findOneBy({ externalId: payload.sub })
                    if (!user) {
                        throw new NotFoundException("Could not find user with this id")
                    }
                    console.log(project)
                    if (project.user.id !== user.id) {
                        throw new ForbiddenException("Cannot access this project")
                    }
                    break
                default:
                    throw new InternalServerErrorException("Not implemented")
            }
            if (!payload.scope.split(" ").includes(requiredScope)) {
                throw new ForbiddenException("Insufficient permissions")
            }
            return true
        } catch {
            throw new UnauthorizedException("An error occured trying to process your AccessToken")
        }
    }
}
