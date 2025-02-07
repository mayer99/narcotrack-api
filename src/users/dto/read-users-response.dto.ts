export class ReadUsersResponseDTO {
    data: {
        id: string
        name: string
        projects: string[]
        created_at: number
        updated_at: number
    }[]
}