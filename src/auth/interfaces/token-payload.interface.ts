export interface TokenPayload {
    sub: string
    type: TokenType
    project?: string
    scope: string[]
}