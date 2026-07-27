import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return { message: 'OpBattle API is running! 🚀' };
  }

  @Get('test')
  test() {
    return { status: 'ok', message: 'Test route is working!' };
  }

  @Post('register')
  async register(@Body() body: any) {
    const { email, password } = body;

    // Simple validation
    if (!email || !email.includes('@')) {
      return { error: 'Invalid email' };
    }

    if (!password || password.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }

    // ✅ Success response
    return {
      success: true,
      message: 'Registration successful!',
      user: {
        email: email,
        role: 'user'
      },
      access_token: 'test_token_' + Date.now()
    };
  }
}
