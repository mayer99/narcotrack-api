
import { Injectable, CanActivate, ExecutionContext, InternalServerErrorException, UnauthorizedException, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC } from './decorators/public.decorator'
import { Request } from 'express'
import { AuthService } from './auth.service';
import { AccessToken } from './entities/access_token.entity';
import { CHECK_SCOPE_KEY } from './decorators/check-scope.decorator';
import { CHECK_PROJECT_KEY } from './decorators/check-project.decorator';
import { SubjectType } from './subject-type.enum';
import { CHECK_USER_KEY } from './decorators/check-user.decorator';
import { ALLOWED_SUBJECT_TYPES_KEY } from './decorators/allowed-subject-types.decorator';

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
    console.log(accessToken)
    if (!accessToken) throw new NotFoundException("Could not find AccessToken")

    if (accessToken.expiresAt.getTime() < Date.now()) throw new ForbiddenException("AccessToken expired")

    if (!accessToken.scopes.includes(scope)) {
      throw new ForbiddenException("Insufficient permissions")
    }

    if (!accessToken.type) {
      throw new InternalServerErrorException("AccessToken has no type")
    }

    const allowedSubjectTypes = this.reflector.getAllAndOverride<SubjectType[]>(ALLOWED_SUBJECT_TYPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (allowedSubjectTypes) {
      if (!allowedSubjectTypes.includes(accessToken.type)) {
        throw new BadRequestException("This endpoint cannot be accessed with AccessToken of type " + accessToken.type)
      }
    }

    const checkProject = this.reflector.getAllAndOverride<boolean>(CHECK_PROJECT_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (checkProject) {
      const requestedProjectId = request.body.project
      if (!requestedProjectId) {
        throw new BadRequestException("You need to define a project")
      }
      switch (accessToken.type) {
        case SubjectType.MACHINE:
          if (!accessToken.project) {
            throw new InternalServerErrorException("AccessToken has no project defined")
          }
          if (accessToken.project.externalId !== requestedProjectId) {
            throw new ForbiddenException("Requesting changes to a project with mismatching AccessToken")
          }
          break
        case SubjectType.USER:
          if (!accessToken.user.projects?.some(project => project.externalId === requestedProjectId) || !accessToken.scopes.includes("projects:access")) {
            throw new ForbiddenException("User does not have a project with the requested projectId or not enough permissions")
          }
          break
        case SubjectType.SERVICE:
          if (accessToken.scopes.includes("projects:access")) {
            throw new ForbiddenException("AccessToken of type service requires projects:access to use this resource")
          }
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
      const userId = request.body.user
      if (!userId) {
        throw new BadRequestException("You need to define a user")
      }
      switch (accessToken.type) {
        case SubjectType.MACHINE:
          throw new ForbiddenException("You need an AccessToken of type service or user to access this resource")
        case SubjectType.USER:
          if (!accessToken.user) {
            throw new InternalServerErrorException("AccessToken of type user has no user defined")
          }
          if (accessToken.user !== userId || !accessToken.scopes.includes("users:foreign")) {
            throw new ForbiddenException("AccessToken of type user can only access matching user of requires scope users:foreign")
          }
          break
        case SubjectType.SERVICE:
          break
        default:
          throw new InternalServerErrorException("Not implemented")
      }
    }
    request["accessToken"] = accessToken
    console.log("Passed AuthGuard")

    return true
  }
}
