import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../ability.factory';
import { CHECK_ABILITY_KEY, RequiredAbility } from '../decorators/check-ability.decorator';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { CHECK_PROJECT_KEY } from '../decorators/check-project.decorator';
import { Request } from 'express';
import { CHECK_USER_KEY } from '../decorators/check-user.decorator.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';




@Injectable()
export class AbilitiesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly abilityFactory: AbilityFactory,
        @InjectRepository(Project)
        private readonly projectsRepo: Repository<Project>,
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredAbility = this.reflector.get<RequiredAbility>(CHECK_ABILITY_KEY, context.getHandler())
        if (!requiredAbility) {
            throw new InternalServerErrorException("RequiredAbility for this endpoint is not defined")
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

            let project
            const checkProject = this.reflector.get<boolean>(CHECK_PROJECT_KEY, context.getHandler())
            if (checkProject) {
                const projectId = request.params['projectId'];
                if (!projectId) {
                    throw new BadRequestException("You need to provide a project id to access this resource")
                }
                project = await this.projectsRepo.findOneBy({ externalId: projectId })
                if (!project) {
                    throw new NotFoundException("Could not find project with this id")
                }
            }

            let user
            const checkUser = this.reflector.get<boolean>(CHECK_USER_KEY, context.getHandler())
            if (checkUser) {
                const userId = request.params['userId'];
                if (!userId) {
                    throw new UnauthorizedException("You need to provide a user id to access this resource")
                }
                user = await this.usersRepo.findOne({
                    where: { externalId: userId },
                    relations: { projects: true }
                })
                if (!user) {
                    throw new NotFoundException("Could not find user with this id")
                }
            }

            const ability = this.abilityFactory.createAbilityFromToken(payload, request)
            return ability.can(requiredAbility.action, requiredAbility.subject)
        } catch {
            throw new UnauthorizedException("An error occured trying to process your AccessToken")
        }
    }
}
