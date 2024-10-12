import { Expose, Transform } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Length, Matches } from "class-validator"
import { Column } from "typeorm"
import { Severity } from "../severity.enum";

export class CreateEventRequestDTO {

    @IsNotEmpty()
    @IsString()
    @Length(2, 500)
    message: string

    @IsNotEmpty()
    @IsString()
    @Length(2, 32)
    type: string

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