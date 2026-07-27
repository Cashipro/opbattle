import { Controller, Get, Post, Put, Delete, Body, Param, Headers, HttpCode, HttpStatus } from '@nestjs/common';

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
      user: { id: userId, email, role: 'user' },
      access_token: userId
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    const { email, password } = body;
    if (!email || !email.includes('@')) return { error: 'Invalid email' };
    if (!password || password.length < 6) return { error: 'Invalid credentials' };
    
    const userId = 'user_' + Date.now();
    return {
      success: true,
      user: { id: userId, email, role: 'user' },
      access_token: userId
    };
  }

  // ============ TEAM ROUTES ============

  // ✅ CREATE TEAM
  @Post('teams')
  @HttpCode(HttpStatus.CREATED)
  async createTeam(@Body() body: any, @Headers('authorization') auth: string) {
    console.log('🔍 Create team request:', body);
    console.log('🔑 Auth header:', auth);

    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const userId = auth.split(' ')[1];
    console.log('👤 User ID:', userId);

    if (!body.name || body.name.trim().length < 2) {
      return { statusCode: 400, message: 'Team name must be at least 2 characters' };
    }

    // Check if user already has a team
    if (userTeamMap.has(userId)) {
      return { statusCode: 400, message: 'You are already in a team' };
    }

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

    teamsStore.set(teamId, newTeam);
    userTeamMap.set(userId, teamId);

    console.log('✅ Team created:', newTeam);
    console.log('📊 Teams store size:', teamsStore.size);
    console.log('📊 UserTeamMap:', Array.from(userTeamMap.entries()));

    return newTeam;
  }

  // ✅ GET MY TEAM
  @Get('teams/my')
  async getMyTeam(@Headers('authorization') auth: string) {
    console.log('🔍 Get my team request');
    console.log('🔑 Auth header:', auth);

    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const userId = auth.split(' ')[1];
    console.log('👤 User ID:', userId);
    console.log('📊 UserTeamMap:', Array.from(userTeamMap.entries()));

    const teamId = userTeamMap.get(userId);
    console.log('🔍 Team ID found:', teamId);

    if (!teamId) {
      console.log('❌ No team found for user');
      return null;
    }

    const team = teamsStore.get(teamId);
    console.log('📊 Team found:', team);

    if (!team) {
      console.log('❌ Team not found in store');
      return null;
    }

    return team;
  }

  // ✅ GET TEAM BY ID
  @Get('teams/:id')
  async getTeam(@Param('id') id: string) {
    const team = teamsStore.get(id);
    if (!team) {
      return { statusCode: 404, message: 'Team not found' };
    }
    return team;
  }

  // ✅ GET ALL TEAMS
  @Get('teams')
  async getTeams() {
    const teams = Array.from(teamsStore.values());
    console.log('📊 All teams:', teams.length);
    return { teams, total: teams.length };
  }

  // ✅ UPDATE TEAM
  @Put('teams/:id')
  async updateTeam(@Param('id') id: string, @Body() body: any, @Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const userId = auth.split(' ')[1];
    const team = teamsStore.get(id);
    if (!team) {
      return { statusCode: 404, message: 'Team not found' };
    }

    if (team.captain_id !== userId) {
      return { statusCode: 403, message: 'Only captain can update team' };
    }

    if (body.name) {
      team.name = body.name.trim();
    }

    teamsStore.set(id, team);
    return team;
  }

  // ✅ DELETE TEAM
  @Delete('teams/:id')
  async deleteTeam(@Param('id') id: string, @Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const userId = auth.split(' ')[1];
    const team = teamsStore.get(id);
    if (!team) {
      return { statusCode: 404, message: 'Team not found' };
    }

    if (team.captain_id !== userId) {
      return { statusCode: 403, message: 'Only captain can delete team' };
    }

    // Remove all members from map
    for (const member of team.members) {
      userTeamMap.delete(member.player_id);
    }

    teamsStore.delete(id);
    return { message: 'Team deleted successfully' };
  }

  // ✅ ADD MEMBER
  @Post('teams/:id/members')
  async addMember(@Param('id') id: string, @Body() body: any, @Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const userId = auth.split(' ')[1];
    const team = teamsStore.get(id);
    if (!team) {
      return { statusCode: 404, message: 'Team not found' };
    }

    if (team.captain_id !== userId) {
      return { statusCode: 403, message: 'Only captain can add members' };
    }

    if (team.members.length >= 4) {
      return { statusCode: 400, message: 'Team is full (max 4 members)' };
    }

    const playerId = body.player_id;
    if (!playerId) {
      return { statusCode: 400, message: 'Player ID is required' };
    }

    // Check if player is already in a team
    if (userTeamMap.has(playerId)) {
      return { statusCode: 400, message: 'Player is already in a team' };
    }

    const newMember = {
      id: 'mem_' + Date.now(),
      player_id: playerId,
      is_captain: false,
      joined_at: new Date().toISOString(),
      player_name: 'Player',
      pubg_uid: 'N/A',
      avatar_url: null
    };

    team.members.push(newMember);
    userTeamMap.set(playerId, team.id);
    teamsStore.set(id, team);

    return team;
  }

  // ✅ REMOVE MEMBER
  @Delete('teams/:id/members/:memberId')
  async removeMember(@Param('id') id: string, @Param('memberId') memberId: string, @Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const userId = auth.split(' ')[1];
    const team = teamsStore.get(id);
    if (!team) {
      return { statusCode: 404, message: 'Team not found' };
    }

    if (team.captain_id !== userId) {
      return { statusCode: 403, message: 'Only captain can remove members' };
    }

    const memberIndex = team.members.findIndex((m: any) => m.id === memberId);
    if (memberIndex === -1) {
      return { statusCode: 404, message: 'Member not found' };
    }

    const member = team.members[memberIndex];
    if (member.is_captain) {
      return { statusCode: 400, message: 'Cannot remove captain' };
    }

    userTeamMap.delete(member.player_id);
    team.members.splice(memberIndex, 1);
    teamsStore.set(id, team);

    return team;
  }

  // ✅ LEAVE TEAM
  @Post('teams/:id/leave')
  async leaveTeam(@Param('id') id: string, @Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer '')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const userId = auth.split(' '')[1];
    const team = teamsStore.get(id);
    if (!team) {
      return { statusCode: 404, message: 'Team not found' };
    }

    if (team.captain_id === userId) {
      return { statusCode: 400, message: 'Captain cannot leave. Delete team instead.' };
    }

    const memberIndex = team.members.findIndex((m: any) => m.player_id === userId);
    if (memberIndex === -1) {
      return { statusCode: 404, message: 'You are not in this team' };
    }

    const member = team.members[memberIndex];
    userTeamMap.delete(member.player_id);
    team.members.splice(memberIndex, 1);
    teamsStore.set(id, team);

    return { message: 'You left the team' };
  }
}
