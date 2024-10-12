
export class GetClientCredentialsResponseDTO {
  clientcredentials: {
    id: string
    client_id: string
    scope: string
    name: string
    description?: string
    access_tokens: string[]
    issued_at: number
  }[]
}