import { ArrayMinSize, ArrayNotEmpty, IsArray, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length } from "class-validator"
export class CreateProjectRequestDTO {

    @IsNotEmpty()
    @IsString()
    @Length(2, 64)
    name: string
    
}