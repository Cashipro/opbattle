import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class TestAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('test-register')
  async testRegister(@Body() body: any) {
    return { message: 'Auth controller is working!', body };
  }
}
