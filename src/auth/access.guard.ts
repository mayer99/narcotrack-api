
import { Injectable, CanActivate, ExecutionContext, InternalServerErrorException, UnauthorizedException, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { AuthService } from './auth.service';
import { CHECK_SCOPE_KEY } from './decorators/check-scope.decorator';
import { ConfigService } from '@nestjs/config';
import { ACCESS_CONTROL_KEY } from './decorators/access-control.decorator';
import { AccessLevel } from './enum/access-level.enum';
import { Environment } from './enum/environment.enum';
import { JwtService } from '@nestjs/jwt';
import { CHECK_PROJECT_KEY } from './decorators/check-project.decorator';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const accessLevel = this.reflector.getAllAndOverride<AccessLevel>(ACCESS_CONTROL_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!accessLevel) {
      throw new InternalServerErrorException("AccessLevel of this endpoint is not properly defined")
    }

    switch (accessLevel) {
      case AccessLevel.PUBLIC:
        console.log("Accessing public route")
        return true
      case AccessLevel.RESTRICTED:
        console.log("Accessing restricted route")
        break
      case AccessLevel.DEVELOPMENT:
        console.log("Accessing development route")
        const environment = this.configService.get<Environment>('environment')
        if (environment !== Environment.DEVELOPMENT)
          throw new ForbiddenException("This route is only available in Environment.DEVELOPMENT")
        return true
      default:
        return false;
    }

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

    const [type, token] = authorizationHeader.split(' ')

    if (type !== "Bearer") {
      throw new BadRequestException('Invalid type of token')
    }

    if (!token) {
      throw new BadRequestException('No token provided')
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token
      )
      if (!payload.scope?.split(" ").includes(scope)) {
        throw new ForbiddenException("Insufficient permissions")
      }

      const clientCredentials = await this.authService.

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
      request["clientId"] = payload
      return true
    } catch {
      throw new UnauthorizedException();
    }
  }
}
