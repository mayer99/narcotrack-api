import { Severity } from "../severity.enum"


export class ReadEventsResponseDTO {
    message?: string
    events: {
        id: string
        message: string
        type: string
        severity: Severity
        device: string
        project: string
        client_credentials: string
        createdAt: number
        receivedAt: number
    }[]
}