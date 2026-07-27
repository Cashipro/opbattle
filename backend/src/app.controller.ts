import { Controller, Get, Post, Body, Param, Headers, HttpCode, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  
  // ✅ HOME
  @Get()
  getHello() {
    return { message: 'OpBattle API is running! 🚀' };
  }

  // ✅ TEST
  @Get('test')
  test() {
    return { status: 'ok', message: 'Test route is working!' };
  }

  // ✅ COUNTRIES
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

  // ✅ REGISTER
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

  // ✅ LOGIN
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    const { email, password } = body;

    if (!email || !email.includes('@')) {
      return { error: 'Invalid email' };
    }

    if (!password || password.length < 6) {
      return { error: 'Invalid credentials' };
    }

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

  // ✅ TEAM CREATE (Direct test route)
  @Post('teams')
  @HttpCode(HttpStatus.CREATED)
  async createTeam(@Body() body: any, @Headers('authorization') auth: string) {
    console.log('🔍 Team create request:', body);
    console.log('🔑 Auth header:', auth);

    // Check if user is authenticated
    if (!auth || !auth.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        message: 'Unauthorized - No token provided',
        error: 'Unauthorized'
      };
    }

    const token = auth.split(' ')[1];
    console.log('📝 Token:', token);

    // Validate team name
    if (!body.name || body.name.trim().length < 2) {
      return {
        statusCode: 400,
        message: 'Team name must be at least 2 characters',
        error: 'Bad Request'
      };
    }

    // ✅ SUCCESS - Return mock team data
    return {
      id: 'team_' + Date.now(),
      name: body.name.trim(),
      captain_id: 'user_' + Date.now(),
      members: [],
      wins: 0,
      losses: 0,
      total_prize: 0,
      ranking: 0,
      max_members: 4,
      is_active: true,
      created_at: new Date().toISOString()
    };
  }

  // ✅ GET MY TEAM (Direct test route)
  @Get('teams/my')
  async getMyTeam(@Headers('authorization') auth: string) {
    console.log('🔍 Get my team request');
    console.log('🔑 Auth header:', auth);

    if (!auth || !auth.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        message: 'Unauthorized - No token provided',
        error: 'Unauthorized'
      };
    }

    // ✅ Return null if no team (frontend will show "No Team Yet")
    return null;
  }

  // ✅ TEAMS LIST
  @Get('teams')
  async getTeams() {
    return {
      teams: [],
      total: 0
    };
  }

  // ✅ TEAM BY ID
  @Get('teams/:id')
  async getTeam(@Param('id') id: string) {
    return {
      id: id,
      name: 'Test Team',
      members: [],
      wins: 0,
      losses: 0,
      total_prize: 0,
      ranking: 0
    };
  }

  // ✅ PUBG TEST
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
