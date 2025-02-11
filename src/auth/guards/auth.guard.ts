import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { REQUIRE_SCOPE_KEY } from '../decorators/require-scope.decorator';
import { REQUIRE_PROJECT_KEY } from '../decorators/require-project.decorator';
import { REQUIRE_USER_KEY } from '../decorators/require-user.decorator.ts';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly jwtService: JwtService,
        @InjectRepository(Project)
        private readonly projectsRepo: Repository<Project>
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredScope = this.reflector.get<string>(REQUIRE_SCOPE_KEY, context.getHandler())
        if (!requiredScope) {
            throw new InternalServerErrorException("RequireScope for this endpoint is not defined")
        }

        if (requiredScope === "none") {
            console.log("Accessing public route")
            return true
        }

        const request = context.switchToHttp().getRequest<Request>()
        const authorizationHeader = request.headers['authorization']
        if (!authorizationHeader) {
            throw new UnauthorizedException('AuthorizationHeader missing')
        }

        const [type, encodedAccessToken] = authorizationHeader.split(' ')

        if (type !== "Bearer") {
            throw new BadRequestException('Invalid type of token')
        }

        if (!encodedAccessToken) {
            throw new BadRequestException('No AccessToken provided')
        }

        try {
            const token: TokenPayload = await this.jwtService.verifyAsync(encodedAccessToken)
            const requireProject = this.reflector.get<boolean>(REQUIRE_PROJECT_KEY, context.getHandler())
            const projectId = request.params['projectId']
            if (requireProject) {
                if (!projectId) {
                    throw new BadRequestException("You need to provide a project id to access this resource")
                }
            }
            const requireUser = this.reflector.get<boolean>(REQUIRE_USER_KEY, context.getHandler())
            const userId = request.params['userId']
            if (requireUser) {
                if (!userId) {
                    throw new BadRequestException("You need to provide a user id to access this resource")
                }
            }
            switch (token.type) {
                case TokenType.DEVICE:
                    if (!requireProject) {
                        throw new ForbiddenException("Device tokens can only endpoints that are related to projects")
                    }
                    if (!token.project) {
                        throw new BadRequestException("Device tokens need to contain a project reference")
                    }
                    if (projectId !== token.project) {
                        throw new ForbiddenException("Device tokens can only access their own project")
                    }
                case TokenType.USER:
                    if (requireProject) {
                        const project = await this.projectsRepo.findOne({
                            where: { externalId: projectId },
                            relations: { user: true }
                        })
                        if (!project) {
                            throw new NotFoundException("Could not find project")
                        }
                        if (project.user.externalId !== token.sub) {
                            throw new ForbiddenException("Cannot acces foreign projects")
                        }
                    }
                    if (requireUser) {
                        if (userId !== token.sub) {
                            throw new ForbiddenException("Cannot access foreign user accounts")
                        }
                    }
                case TokenType.SERVICE:
                    break
                default:
                    throw new BadRequestException("Unknown type of token")
            }

            if (token.scope.includes(requiredScope)) {
                throw new ForbiddenException("Insufficient permissions")
            }
            return true
        } catch {
            throw new UnauthorizedException("An error occured trying to process your AccessToken")
        }
    }
}
