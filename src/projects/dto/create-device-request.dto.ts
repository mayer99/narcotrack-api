import { Expose, Transform } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Length, Matches } from "class-validator"
import { Column } from "typeorm"
import { Severity } from "../severity.enum";

export class CreateDeviceRequestDTO {

    @IsNotEmpty()
    @IsString()
    @Length(2, 100)
    name: string
    
}