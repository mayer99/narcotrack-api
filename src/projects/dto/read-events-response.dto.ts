import { Severity } from "../severity.enum"


export class ReadEventsResponseDTO {
    data: {
        id: string
        message: string
        type: string
        severity: Severity
        device: string
        project: string
        createdAt: number
        receivedAt: number
    }[]
}