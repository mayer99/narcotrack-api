export class ReadUsersResponseDTO {
    message?: string
    users: {
        id: string
        name: string
        created_at: number
        updated_at: number
    }[]
}