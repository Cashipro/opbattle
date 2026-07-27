import { Controller, Get, Post, Body, Param } from '@nestjs/common';

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

  // ✅ REGISTER ROUTE
  @Post('register')
  async register(@Body() body: any) {
    const { email, password } = body;

    if (!email || !email.includes('@')) {
      return { error: 'Invalid email' };
    }

    if (!password || password.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }

    return {
      success: true,
      message: 'Registration successful!',
      user: {
        id: 'user_' + Date.now(),
        email: email,
        role: 'user'
      },
      access_token: 'token_' + Date.now()
    };
  }

  // ✅ LOGIN ROUTE (ADD THIS)
  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;

    if (!email || !email.includes('@')) {
      return { error: 'Invalid email' };
    }

    if (!password || password.length < 6) {
      return { error: 'Invalid credentials' };
    }

    // ✅ For testing, any email/password works
    return {
      success: true,
      message: 'Login successful!',
      user: {
        id: 'user_' + Date.now(),
        email: email,
        role: 'user'
      },
      access_token: 'token_' + Date.now()
    };
  }

  // ✅ PUBG TEST ROUTE
  @Get('pubg-test/:name')
  async testPubg(@Param('name') name: string) {
    const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZWM2MjU4MC02Yjk1LTAxM2YtZjRkMS01MmUzZDQzMTI2MTAiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNzg1MTIxNDk2LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im9wYmF0dGxlIn0.18NDDV70YNsRHkk75zPYGgrGvUjAxVXYuOxpsiR0LS8';
    
    const url = `https://api.pubg.com/shards/steam/players?filter[playerNames]=${encodeURIComponent(name)}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/vnd.api+json',
      },
    });

    const data = await response.json();

    return {
      status: response.status,
      data: data
    };
  }
}
