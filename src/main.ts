import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { LogMiddleware } from './log.middleware'
import * as fs from 'fs'
import helmet from 'helmet'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {

  const app = await NestFactory.create(AppModule)
  
  const configService = app.get(ConfigService)
  const origins = configService.get<string[]>('origins')
  app.enableCors({
    origin: origins,
    credentials: true,
  })

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))

  app.use(new LogMiddleware().use);
  app.use(helmet())

  await app.listen(3000)
}

bootstrap()
