import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller()
export class AppController {
  
  @Get()
  getHello() {
    return { message: 'OpBattle API is running! 🚀' };
  }

  @Get('test')
  test() {
    return { status: 'ok', message: 'Test route is working!' };
  }

  @Get('countries')
  getCountries() {
    return [
      { id: '1', name: 'Pakistan', code: 'PK' },
      { id: '2', name: 'Saudi Arabia', code: 'SA' },
      { id: '3', name: 'Oman', code: 'OM' },
      { id: '4', name: 'Qatar', code: 'QA' },
      { id: '5', name: 'Bangladesh', code: 'BD' },
      { id: '6', name: 'India', code: 'IN' },
      { id: '7', name: 'USA', code: 'US' },
      { id: '8', name: 'UK', code: 'UK' },
    ];
  }

  @Post('register')
  async register(@Body() body: any) {
    const { email, password } = body;

    // Validation
    if (!email || !email.includes('@')) {
      return { error: 'Invalid email' };
    }

    if (!password || password.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }

    // ✅ SUCCESS
    return {
      success: true,
      message: 'Registration successful!',
      user: {
        id: 'user_' + Date.now(),
        email: email,
        role: 'user'
      },
      access_token: 'token_' + Date.now() + '_' + Math.random().toString(36).substring(7)
    };
  }
}
