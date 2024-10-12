import { SetMetadata } from '@nestjs/common'
import { SubjectType } from '../subject-type.enum'

export const CHECK_SUBJECT_TYPE_KEY = 'checkSubjectType'
export const CheckSubjectType = (...allowedSubjectTypes: SubjectType[]) => SetMetadata(CHECK_SUBJECT_TYPE_KEY, allowedSubjectTypes)
