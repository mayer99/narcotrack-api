import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessControl } from './auth/decorators/access-control.decorator';
import { AccessLevel } from './auth/enum/access-level.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @AccessControl(AccessLevel.PUBLIC)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  } 
}
