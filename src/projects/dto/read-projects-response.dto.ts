export class ReadProjectsResponseDTO {
    projects: {
        id: string
        name: string
        user: string
        created_at: number
        updated_at: number
    }[]
}