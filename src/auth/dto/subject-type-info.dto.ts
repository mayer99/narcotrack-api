import { SubjectType } from "../subject-type.enum"

export class SubjectInfoDTO {
    type: SubjectType
    userId?: string
    projectId?: string
}