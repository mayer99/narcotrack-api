
export class CreateClientCredentialsResponseDTO {
  client_id: string
  client_secret: string
  device: string
  scope: string[]
  name: string
  description?: string
}