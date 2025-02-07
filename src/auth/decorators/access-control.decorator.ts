import { SetMetadata } from '@nestjs/common';
import { AccessLevel } from '../enum/access-level.enum';

export const ACCESS_CONTROL_KEY = 'accessLevel'
export const AccessControl = (accessLevel: AccessLevel) => SetMetadata('accessLevel', accessLevel);
