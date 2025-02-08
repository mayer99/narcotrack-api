export interface TokenPayload {
    sub: string // ClientId bei device, 
    type: TokenType
    project?: string
    scope: string // 
}