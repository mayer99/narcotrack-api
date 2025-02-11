import { SetMetadata } from '@nestjs/common'

export const REQUIRE_PROJECT_KEY = 'requireProject'
export const RequireProject = () => SetMetadata(REQUIRE_PROJECT_KEY, true)
