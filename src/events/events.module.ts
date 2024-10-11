import { Module } from '@nestjs/common'
import { EventsController } from './events.controller'
import { EventsService } from './events.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from 'src/projects/entities/project.entity'
import { AuthModule } from 'src/auth/auth.module'
import { Event } from './entities/event.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([ Event, Project ]),
    AuthModule
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
