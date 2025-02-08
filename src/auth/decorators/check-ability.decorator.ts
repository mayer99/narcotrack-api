// check-abilities.decorator.ts
import { SetMetadata } from '@nestjs/common';

export interface RequiredAbility {
    action: string
    subject: string
}

export const CHECK_ABILITY_KEY = 'check_ability'

export const CheckAbility = (ability: RequiredAbility) => SetMetadata(CHECK_ABILITY_KEY, ability)
