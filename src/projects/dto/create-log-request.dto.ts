import { ArrayMinSize, ArrayNotEmpty, IsArray, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length } from "class-validator"
import { Severity } from "../severity.enum"

export class CreateLogRequestDTO {

    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    @Length(2, 500, { each: true })
    messages: string[]

    @IsNotEmpty()
    @IsEnum(Severity)
    severity: Severity

    @IsNotEmpty()
    @IsString()
    @Length(2, 64)
    device: string

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    created_at: number
}