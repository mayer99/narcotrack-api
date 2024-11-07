import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsEnum } from 'class-validator'
import { ClientType } from '../client-type.enum'

export class CreateClientCredentialsRequestDTO {

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Matches(/^[a-zA-Z0-9 ]+$/, { message: 'name can only contain letters, numbers and spaces' })
  name: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  description?: string

  @IsString()
  @IsNotEmpty()
  @Length(2, 500)
  @Matches(/^[a-zA-Z0-9: ]+$/, { message: 'scope can only contain letters, numbers, spaces and colons' })
  scope: string

}