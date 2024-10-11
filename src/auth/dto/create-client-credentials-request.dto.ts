import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsEnum } from 'class-validator'
import { SubjectType } from '../subject-type.enum'

export class CreateClientCredentialsRequestDTO {

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'name can only contain letters and numbers' })
  name: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  description?: string

  @IsString()
  @IsNotEmpty()
  @Length(2, 250)
  @Matches(/^[a-zA-Z0-9: ]+$/, { message: 'scope can only contain letters, numbers, spaces and colons' })
  scope: string

  @IsNotEmpty()
  @IsEnum(SubjectType)
  type: SubjectType

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'project can only contain letters and numbers' })
  project?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'project can only contain letters and numbers' })
  user?: string

}