import { Severity } from "../severity.enum"

export class CreateLogResponseDTO {
    id: string
    message: string
    severity: Severity
    device: string
    project: string
}