import { SetMetadata } from '@nestjs/common';
import { SubjectType } from '../subject-type.enum';

export const ALLOWED_SUBJECT_TYPES_KEY = 'allowedSubjectTypes';
export const AllowedSubjectTypes = (...allowedSubjectTypes: SubjectType[]) => SetMetadata(ALLOWED_SUBJECT_TYPES_KEY, allowedSubjectTypes);
