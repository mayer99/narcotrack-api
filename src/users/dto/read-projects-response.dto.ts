export class ReadProjectsResponseDTO {
    message?: string
    projects: {
        id: string
        name: string
        created_at: number
        updated_at: number
    }[]
}