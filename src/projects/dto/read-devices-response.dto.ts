import { Severity } from "../severity.enum"


export class ReadDevicesResponseDTO {
    data: {
        id: string
        name: string
        project: string
        client_credentials: string[]
        createdAt: number
    }[]
}