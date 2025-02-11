import { IsString, IsNotEmpty, Length, Matches, IsOptional } from 'class-validator'

export class CreateAccessTokenRequestDTO {

  @IsString()
  @IsNotEmpty()
  @Length(64, 64)
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'client_id can only contain letters and numbers' })
  client_id: string

  @IsString()
  @IsNotEmpty()
  @Length(64, 64)
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'client_secret can only contain letters and numbers' })
  client_secret: string

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'grant_type can only contain letters, numbers and underscores' })
  grant_type: string

  @IsString()
  @IsNotEmpty()
  @Length(64, 64)
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'audience can only contain letters and numbers' })
  audience: string

}