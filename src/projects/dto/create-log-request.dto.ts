import { ArrayMinSize, ArrayNotEmpty, IsArray, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length } from "class-validator"
import { Severity } from "../severity.enum"

export class CreateLogRequestDTO {

    @IsNotEmpty()
    @IsString()
    @Length(2, 200)
    message: string

    @IsNotEmpty()
    @IsEnum(Severity)
    severity: Severity

    @IsNotEmpty()
    @IsString()
    @Length(64, 64)
    device: string

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    created_at: number
}