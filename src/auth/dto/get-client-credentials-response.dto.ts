
export class GetClientCredentialsResponseDTO {
  message?: string
  client_credentials: {
    id: string
    client_id: string
    scope: string
    name: string
    description?: string
    issued_at: number
  }[]
}