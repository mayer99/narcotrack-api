import { ArrayMinSize, ArrayNotEmpty, IsArray, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Matches } from "class-validator"

export class ReadEventsRequestDTO {
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'project can only contain letters and numbers' })
    project: string
}