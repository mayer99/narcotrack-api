export class ReadUsersResponseDTO {
    users: {
        id: string
        name: string
        created_at: number
        updated_at: number
    }[]
}