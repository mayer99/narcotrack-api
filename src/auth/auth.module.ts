import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccessToken } from './entities/access_token.entity'
import { ClientCredentials } from './entities/client_credentials.entity'
import { Project } from 'src/projects/entities/project.entity'
import { User } from 'src/users/entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessToken, ClientCredentials, Project, User])
  ],
  providers:[AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}