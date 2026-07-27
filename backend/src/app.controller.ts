import { Controller, Get, Post, Body, Param, Headers, HttpCode, HttpStatus } from '@nestjs/common';

// In-memory storage (production mein database use karna)
const teamsStore = new Map();
const userTeamMap = new Map();

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

    if (!email || !email.includes('@')) {
      return { error: 'Invalid email' };
    }

    if (!password || password.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }

    const userId = 'user_' + Date.now();
    return {
      success: true,
      message: 'Registration successful!',
      user: {
        id: userId,
        email: email,
        role: 'user'
      },
      access_token: 'token_' + userId
    };
  }

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

    const userId = 'user_' + Date.now();
    return {
      success: true,
      message: 'Login successful!',
      user: {
        id: userId,
        email: email,
        role: 'user'
      },
      access_token: 'token_' + userId
    };
  }

  // ✅ CREATE TEAM
  @Post('teams')
  @HttpCode(HttpStatus.CREATED)
  async createTeam(@Body() body: any, @Headers('authorization') auth: string) {
    console.log('🔍 Create team request:', body);

    if (!auth || !auth.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized'
      };
    }

    if (!body.name || body.name.trim().length < 2) {
      return {
        statusCode: 400,
        message: 'Team name must be at least 2 characters',
        error: 'Bad Request'
      };
    }

    // Extract user ID from token (temporary)
    const token = auth.split(' ')[1];
    const userId = token.replace('token_', '');

    // Create team
    const teamId = 'team_' + Date.now();
    const newTeam = {
      id: teamId,
      name: body.name.trim(),
      captain_id: userId,
      members: [
        {
          id: 'mem_' + Date.now(),
          player_id: userId,
          is_captain: true,
          joined_at: new Date().toISOString(),
          player_name: 'Captain',
          pubg_uid: 'N/A',
          avatar_url: null
        }
      ],
      wins: 0,
      losses: 0,
      total_prize: 0,
      ranking: 0,
      max_members: 4,
      is_active: true,
      created_at: new Date().toISOString()
    };

    // Save to in-memory store
    teamsStore.set(teamId, newTeam);
    userTeamMap.set(userId, teamId);

    console.log('✅ Team created:', newTeam);

    return newTeam;
  }

  // ✅ GET MY TEAM (FIXED)
  @Get('teams/my')
  async getMyTeam(@Headers('authorization') auth: string) {
    console.log('🔍 Get my team request');

    if (!auth || !auth.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized'
      };
    }

    const token = auth.split(' ')[1];
    const userId = token.replace('token_', '');

    const teamId = userTeamMap.get(userId);
    console.log('🔍 User ID:', userId, 'Team ID:', teamId);

    if (!teamId) {
      // ✅ Return null if no team (frontend handles this)
      return null;
    }

    const team = teamsStore.get(teamId);
    if (!team) {
      return null;
    }

    console.log('✅ Team found:', team);
    return team;
  }

  // ✅ GET TEAM BY ID
  @Get('teams/:id')
  async getTeam(@Param('id') id: string) {
    const team = teamsStore.get(id);
    if (!team) {
      return {
        statusCode: 404,
        message: 'Team not found',
        error: 'Not Found'
      };
    }
    return team;
  }

  // ✅ GET ALL TEAMS
  @Get('teams')
  async getTeams() {
    const teams = Array.from(teamsStore.values());
    return {
      teams: teams,
      total: teams.length
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
