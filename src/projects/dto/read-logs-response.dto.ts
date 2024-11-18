import { Severity } from "../severity.enum"

export class ReadLogsResponseDTO {
    message?: string
    logs: {
        id: string
        messages: string[]
        severity: Severity
        device: string
        project: string
        client_credentials: string
        createdAt: number
        receivedAt: number
    }[]
}