import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { AuthGuard } from './auth/auth.guard'
import { LogMiddleware } from './log.middleware'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  app.use(new LogMiddleware().use);
  await app.listen(3000)
}
bootstrap()
