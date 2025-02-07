import { Severity } from "../severity.enum"

export class CreateEventResponseDTO {
    id: string
    message: string
    type: string
    severity: Severity
    device: string
    project: string
}