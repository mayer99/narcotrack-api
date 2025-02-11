import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Log } from './entities/log.entity';
import { Event } from './entities/event.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Device } from './entities/device.entity';
import { ClientCredentials } from './entities/client_credentials.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Project, Log, Event, Device, ClientCredentials ]),
    AuthModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
