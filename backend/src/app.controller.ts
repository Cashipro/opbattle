import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return { message: 'OpBattle API is running! 🚀' };
  }

  // ✅ YE ROUTE PEHLE SE KAAM KAR RAHA HAI
  @Get('test')
  test() {
    return { status: 'ok', message: 'Test route is working!' };
  }

  // ✅ AB YE BHI KAAM KAREGA
  @Post('register')
  register(@Body() body: any) {
    return { 
      message: 'Register route is working!', 
      received: body,
      timestamp: new Date().toISOString()
    };
  }
}
