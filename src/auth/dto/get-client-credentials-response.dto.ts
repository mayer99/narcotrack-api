
export class GetClientCredentialsResponseDTO {
  client_credentials: {
    id: string
    client_id: string
    scope: string
    name: string
    description?: string
    access_tokens: string[]
    issued_at: number
  }[]
}