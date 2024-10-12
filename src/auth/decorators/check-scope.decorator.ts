import { SetMetadata } from '@nestjs/common'

export const CHECK_SCOPE_KEY = 'checkScope'
export const CheckScope = (scope: string) => SetMetadata(CHECK_SCOPE_KEY, scope)
