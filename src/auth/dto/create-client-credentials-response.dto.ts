import { SubjectType } from "../subject-type.enum"

export class CreateClientCredentialsResponseDTO {
  client_id: string
  client_secret: string
  scope: string
  type: SubjectType
  project?: string
  user?: string
}