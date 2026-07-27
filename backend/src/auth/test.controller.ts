import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('ping')
  ping() {
    return { status: 'ok', message: 'Auth module is loaded!' };
  }
}
