import { SetMetadata } from '@nestjs/common'
import { ClientType as ClientType } from '../client-type.enum'

export const CHECK_CLIENT_TYPE_KEY = 'checkClientType'
export const CheckClientType = (...allowedClientTypes: ClientType[]) => SetMetadata(CHECK_CLIENT_TYPE_KEY, allowedClientTypes)
