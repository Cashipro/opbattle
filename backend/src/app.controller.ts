import { Controller, Get, Post, Body, Param, Headers, HttpCode, HttpStatus } from '@nestjs/common';

// In-memory storage
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
    if (!email || !email.includes('@')) return { error: 'Invalid email' };
    if (!password || password.length < 6) return { error: 'Password must be at least 6 characters' };
    
    const userId = 'user_' + Date.now();
    return {
      success: true,
      message: 'Registration successful!',
      user: { id: userId, email, role: 'user' },
      access_token: userId // ✅ SIMPLE TOKEN = USER ID
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    const { email, password } = body;
    if (!email || !email.includes('@')) return { error: 'Invalid email' };
    if (!password || password.length < 6) return { error: 'Invalid credentials' };
    
    // ✅ FIXED USER ID FOR TESTING (TAKE TEAM SHOW HO)
    const userId = 'user_fixed_123';
    return {
      success: true,
      message: 'Login successful!',
      user: { id: userId, email, role: 'user' },
      access_token: userId
    };
  }

  // ✅ CREATE TEAM (Dummy Data Bhi Save Kar Raha Hai)
  @Post('teams')
  @HttpCode(HttpStatus.CREATED)
  async createTeam(@Body() body: any, @Headers('authorization') auth: string) {
    console.log('🔍 Create team request:', body);
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const userId = auth.split(' ')[1];
    console.log('👤 User ID from token:', userId);

    // ✅ TEAM 1 (Jo Create Ho Rahi Hai)
    const teamId = 'team_' + Date.now();
    const newTeam = {
      id: teamId,
      name: body.name.trim(),
      captain_id: userId,
      members: [{ id: 'mem_1', player_id: userId, is_captain: true, joined_at: new Date().toISOString(), player_name: 'Captain', pubg_uid: 'N/A', avatar_url: null }],
      wins: 0, losses: 0, total_prize: 0, ranking: 0, max_members: 4, is_active: true, created_at: new Date().toISOString()
    };

    teamsStore.set(teamId, newTeam);
    userTeamMap.set(userId, teamId);
    console.log('✅ Team created:', newTeam);

    // ✅ TEAM 2 (DUMMY DATA - HAMESHA SHOW HOGA)
    const dummyTeam = {
      id: 'team_dummy_123',
      name: 'DEMO TEAM (Test)',
      captain_id: 'user_fixed_123',
      members: [{ id: 'mem_dummy_1', player_id: 'user_fixed_123', is_captain: true, joined_at: new Date().toISOString(), player_name: 'Demo Captain', pubg_uid: '1234567890', avatar_url: null }],
      wins: 5, losses: 2, total_prize: 100, ranking: 1, max_members: 4, is_active: true, created_at: new Date().toISOString()
    };
    teamsStore.set('team_dummy_123', dummyTeam);
    userTeamMap.set('user_fixed_123', 'team_dummy_123');

    return newTeam;
  }

  // ✅ GET MY TEAM (HAMESHA TEAM RETURN KAREGA)
  @Get('teams/my')
  async getMyTeam(@Headers('authorization') auth: string) {
    console.log('🔍 Get my team request');
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const userId = auth.split(' ')[1];
    console.log('👤 User ID from token:', userId);

    // ✅ Agar user 'user_fixed_123' hai toh dummy team bhejo
    if (userId === 'user_fixed_123') {
      console.log('✅ Sending DUMMY team for test user');
      return teamsStore.get('team_dummy_123');
    }

    // ✅ Baqi users ki team dhoondho
    const teamId = userTeamMap.get(userId);
    if (!teamId) {
      console.log('❌ No team found');
      return null;
    }
    const team = teamsStore.get(teamId);
    console.log('✅ Team found:', team);
    return team;
  }

  @Get('teams/:id')
  async getTeam(@Param('id') id: string) {
    return teamsStore.get(id) || { statusCode: 404, message: 'Team not found' };
  }

  @Get('teams')
  async getTeams() {
    return { teams: Array.from(teamsStore.values()), total: teamsStore.size };
  }

  @Get('pubg-test/:name')
  async testPubg(@Param('name') name: string) {
    const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZWM2MjU4MC02Yjk1LTAxM2YtZjRkMS01MmUzZDQzMTI2MTAiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNzg1MTIxNDk2LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im9wYmF0dGxlIn0.18NDDV70YNsRHkk75zPYGgrGvUjAxVXYuOxpsiR0LS8';
    const url = `https://api.pubg.com/shards/steam/players?filter[playerNames]=${encodeURIComponent(name)}`;
    const response = await fetch(url, { headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' } });
    const data = await response.json();
    return { status: response.status, data };
  }
}
