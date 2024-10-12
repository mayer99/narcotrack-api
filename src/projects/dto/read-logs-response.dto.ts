import { Severity } from "../severity.enum"

export class ReadLogsResponseDTO {
    logs: {
        id: string
        messages: string[]
        severity: Severity
        device: string
        project: string
        access_token: string
        client_credentials: string
        createdAt: number
        receivedAt: number
    }[]
}