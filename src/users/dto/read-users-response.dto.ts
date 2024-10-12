export class ReadUsersResponseDTO {
    users: {
        id: string
        name: string
        projects: string[]
        accessTokens: string[]
        clientCredentials: string[]
        created_at: number
        updated_at: number
    }[]
}