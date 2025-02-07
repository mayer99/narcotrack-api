import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccessToken } from './entities/access_token.entity'
import { ClientCredentials } from './entities/client_credentials.entity'
import { Project } from 'src/projects/entities/project.entity'
import { User } from 'src/users/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessToken, ClientCredentials, Project, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: {
          expiresIn: "72h",
          allowInsecureKeySizes: false,
          audience: "narcotrack-api",
          issuer: "narcotrack-api"
        }
      }),
      inject: [ConfigService],
    }),
  ],
  providers:[AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}