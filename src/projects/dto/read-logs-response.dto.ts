import { Severity } from "../severity.enum"

export class ReadLogsResponseDTO {
    data: {
        id: string
        message: string
        severity: Severity
        device: string
        project: string
        createdAt: number
        receivedAt: number
    }[]
}