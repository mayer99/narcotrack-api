
import { Injectable, CanActivate, ExecutionContext, InternalServerErrorException, UnauthorizedException, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC } from './decorators/public.decorator'
import { Request } from 'express'
import { AuthService } from './auth.service';
import { AccessToken } from './entities/access_token.entity';
import { CHECK_SCOPE_KEY } from './decorators/check-scope.decorator';
import { CHECK_PROJECT_KEY } from './decorators/check-project.decorator';
import { ClientType } from './client-type.enum';
import { CHECK_CLIENT_TYPE_KEY } from './decorators/check-client-type.decorator';
import { CHECK_USER_KEY } from './decorators/check-user.decorator.ts';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ])
    console.log("Accessing public route")
    if (isPublic) return true

    const scope = this.reflector.getAllAndOverride<string>(CHECK_SCOPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!scope) {
      throw new InternalServerErrorException("scope of this endpoint is not properly defined")
    }

    const request = context.switchToHttp().getRequest<Request>()
    const authorizationHeader = request.headers.authorization
    if (!authorizationHeader) {
      throw new UnauthorizedException('AuthorizationHeader missing')
    }

    const [type, secret] = authorizationHeader.split(' ')

    if (type !== "Bearer") {
      throw new BadRequestException('Invalid type of token')
    }

    if (!secret) {
      throw new BadRequestException('No secret provided')
    }

    const accessToken: AccessToken = await this.authService.getAccessTokenBySecret(secret)
    if (!accessToken) throw new NotFoundException("Could not find AccessToken")

    if (accessToken.expiresAt.getTime() < Date.now()) throw new ForbiddenException("AccessToken expired")

    if (!accessToken.scopes.includes(scope)) {
      throw new ForbiddenException("Insufficient permissions")
    }

    if (!accessToken.type) {
      throw new InternalServerErrorException("AccessToken has no type")
    }

    const allowedClientTypes = this.reflector.getAllAndOverride<ClientType[]>(CHECK_CLIENT_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (allowedClientTypes) {
      if (!allowedClientTypes.includes(accessToken.type)) {
        throw new BadRequestException("This endpoint cannot be accessed with AccessToken of type " + accessToken.type)
      }
    }

    const checkProject = this.reflector.getAllAndOverride<boolean>(CHECK_PROJECT_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (checkProject) {
      const projectId = request.params["projectId"]
      if (!projectId) {
        throw new BadRequestException("You need to define a project")
      }
      switch (accessToken.type) {
        case ClientType.MACHINE:
          if (!accessToken.project) {
            throw new InternalServerErrorException("AccessToken has no project defined")
          }
          if (accessToken.project.externalId !== projectId) {
            throw new ForbiddenException("Requesting changes to a project with mismatching AccessToken")
          }
          break
        case ClientType.USER:
          if (!accessToken.user.projects?.some(project => project.externalId === projectId)) {
            throw new ForbiddenException("User can only modify projects of themselves")
          }
          break
        case ClientType.SERVICE:
          break
        default:
          throw new InternalServerErrorException("Not implemented")
      }
    }

    const checkUser = this.reflector.getAllAndOverride<boolean>(CHECK_USER_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (checkUser) {
      const userId = request.params["userId"]
      if (!userId) {
        throw new BadRequestException("You need to define a user")
      }
      switch (accessToken.type) {
        case ClientType.MACHINE:
          throw new ForbiddenException("AccessToken of type machine cannot access this endpoint")
        case ClientType.USER:
          if (!accessToken.user) {
            throw new InternalServerErrorException("AccessToken of type user has no user defined")
          }
          if (accessToken.user.externalId !== userId) {
            throw new ForbiddenException("User can only modify themselves")
          }
          break
        case ClientType.SERVICE:
          break
        default:
          throw new InternalServerErrorException("Not implemented")
      }
    }
    request["accessToken"] = accessToken
    return true
  }
}
