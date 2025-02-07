import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { User } from 'src/users/entities/user.entity';
import { Log } from './entities/log.entity';
import { Event } from './entities/event.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Device } from './entities/device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Project, Log, Event, Device ]),
    AuthModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
