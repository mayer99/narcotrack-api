import { Injectable } from '@nestjs/common';
import { defineAbility } from '@casl/ability';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AbilityFactory {
  createAbilityFromToken(token: TokenPayload) {
    return defineAbility((can, cannot) => {
      cannot('manage', 'all')
      if (!token.scope) return
      const scopes = token.scope.split(' ')

      switch (token.type) {
        case TokenType.DEVICE:
          const projectId = token.project
          if (!projectId) return
          if (scopes.includes('event:create')) {
            can('create', 'Event', { externalId: projectId })
          }
          if (scopes.includes('log:create')) {
            can('create', 'Log', { externalId: projectId })
          }
          return
        default:
          return
      }
    })
  }
}
can('create', 'Log', {
  owner: { externalId: token.sub }
})