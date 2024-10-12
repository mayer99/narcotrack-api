import { SetMetadata } from '@nestjs/common'

export const CHECK_PROJECT_KEY = 'checkProject'
export const CheckProject = () => SetMetadata(CHECK_PROJECT_KEY, true)
