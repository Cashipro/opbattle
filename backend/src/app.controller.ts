import { Controller, Get, Post, Put, Delete, Body, Param, Headers, HttpCode, HttpStatus } from '@nestjs/common';

// In-memory storage
const teams = new Map();
const userTeamMap = new Map();
let tournaments = [];
let tournamentIdCounter = 1;

@Controller()
export class AppController {

  // ========== HEALTH ==========
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

  // ========== AUTH ==========
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

  // ========== USERS ==========
  @Get('users/me')
  async getMe(@Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }
    const userId = auth.split(' ')[1];
    return {
      id: userId,
      email: 'user@email.com',
      role: 'user'
    };
  }

  // ========== PLAYERS ==========
  @Get('players/me')
  async getMyPlayer(@Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }
    const userId = auth.split(' ')[1];
    return {
      id: 'player_' + userId,
      user_id: userId,
      pubg_uid: '1234567890',
      player_name: 'Player',
      country_id: '1',
      device_type: 'MOBILE',
      level: 1,
      rank: 'Gold',
      season_tier: 'Gold III',
      matches_played: 0,
      wins: 0,
      kills: 0,
      kd_ratio: 0,
      tournament_played: 0,
      tournament_wins: 0,
      total_winnings: 0,
      verification_status: 'PENDING',
      is_banned: false
    };
  }

  @Put('players/me')
  async updateMyPlayer(@Body() body: any, @Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }
    return {
      id: 'player_' + auth.split(' ')[1],
      ...body,
      updated_at: new Date().toISOString()
    };
  }

  // ========== TEAM ROUTES ==========
  @Post('teams')
  @HttpCode(HttpStatus.CREATED)
  async createTeam(@Body() body: any, @Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const userId = auth.split(' ')[1];
    
    if (!body.name || body.name.trim().length < 2) {
      return { statusCode: 400, message: 'Team name must be at least 2 characters' };
    }

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

    teams.set(teamId, newTeam);
    userTeamMap.set(userId, teamId);

    return newTeam;
  }

  @Get('teams/my')
  async getMyTeam(@Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer '')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const userId = auth.split(' ')[1];
    const teamId = userTeamMap.get(userId);

    if (!teamId) {
      return null;
    }

    const team = teams.get(teamId);
    if (!team) {
      return null;
    }

    return team;
  }

  @Get('teams')
  async getAllTeams() {
    return {
      teams: Array.from(teams.values()),
      total: teams.size
    };
  }

  // ========== TOURNAMENT ROUTES ==========

  @Post('tournaments')
  @HttpCode(HttpStatus.CREATED)
  async createTournament(@Body() body: any, @Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    if (!body.title || body.title.trim().length < 3) {
      return { statusCode: 400, message: 'Title is required (min 3 characters)' };
    }

    if (!body.start_date) {
      return { statusCode: 400, message: 'Start date is required' };
    }

    const userId = auth.split(' ')[1];
    const newTournament = {
      id: 'tournament_' + Date.now(),
      title: body.title.trim(),
      description: body.description || '',
      game: body.game || 'PUBG Mobile',
      mode: body.mode || 'Solo',
      country: body.country || 'Global',
      entry_fee: parseFloat(body.entry_fee) || 0,
      prize_pool: parseFloat(body.prize_pool) || 0,
      max_teams: parseInt(body.max_teams) || 10,
      current_teams: 0,
      start_date: body.start_date,
      registration_deadline: body.registration_deadline || body.start_date,
      status: 'UPCOMING',
      rules: body.rules || '',
      prize_distribution: body.prize_distribution || '',
      created_by: userId,
      is_active: true,
      created_at: new Date().toISOString(),
      registrations: []
    };

    tournaments.push(newTournament);
    return newTournament;
  }

  @Get('tournaments')
  async getAllTournaments() {
    return {
      tournaments: tournaments,
      total: tournaments.length
    };
  }

  @Get('tournaments/upcoming')
  async getUpcomingTournaments() {
    const upcoming = tournaments.filter(t => t.status === 'UPCOMING');
    return { tournaments: upcoming, total: upcoming.length };
  }

  @Get('tournaments/:id')
  async getTournamentById(@Param('id') id: string, @Headers('authorization') auth: string) {
    const tournament = tournaments.find(t => t.id === id);
    if (!tournament) {
      return { statusCode: 404, message: 'Tournament not found' };
    }

    let isRegistered = false;
    if (auth && auth.startsWith('Bearer ')) {
      const userId = auth.split(' ')[1];
      isRegistered = tournament.registrations?.some((r: any) => r.user_id === userId) || false;
    }

    return {
      ...tournament,
      is_registered: isRegistered,
      can_register: tournament.status === 'UPCOMING' && 
                    new Date() < new Date(tournament.registration_deadline) &&
                    tournament.current_teams < tournament.max_teams
    };
  }

  @Post('tournaments/:id/register')
  async registerForTournament(@Param('id') id: string, @Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const userId = auth.split(' ')[1];
    const tournament = tournaments.find(t => t.id === id);
    if (!tournament) {
      return { statusCode: 404, message: 'Tournament not found' };
    }

    if (tournament.status !== 'UPCOMING') {
      return { statusCode: 400, message: 'Tournament is not accepting registrations' };
    }

    if (tournament.current_teams >= tournament.max_teams) {
      return { statusCode: 400, message: 'Tournament is full' };
    }

    if (tournament.registrations?.some((r: any) => r.user_id === userId)) {
      return { statusCode: 400, message: 'Already registered' };
    }

    const registration = {
      id: 'reg_' + Date.now(),
      user_id: userId,
      registered_at: new Date().toISOString(),
      status: 'PENDING'
    };

    if (!tournament.registrations) tournament.registrations = [];
    tournament.registrations.push(registration);
    tournament.current_teams = (tournament.current_teams || 0) + 1;

    return { message: 'Successfully registered!', registration };
  }

  @Get('tournaments/my')
  async getMyTournaments(@Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const userId = auth.split(' ')[1];
    const myTournaments = tournaments.filter(t => 
      t.registrations?.some((r: any) => r.user_id === userId)
    );

    return { tournaments: myTournaments, total: myTournaments.length };
  }

  // ========== DASHBOARD ==========
  @Get('dashboard/stats')
  async getDashboardStats(@Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const userId = auth.split(' ')[1];
    const myTournaments = tournaments.filter(t => 
      t.registrations?.some((r: any) => r.user_id === userId)
    );

    return {
      tournaments_played: myTournaments.length,
      tournaments_won: 0,
      total_winnings: 0,
      team_name: 'No Team',
      upcoming_tournaments: tournaments.filter(t => t.status === 'UPCOMING').slice(0, 3)
    };
  }

  // ========== WALLET ==========
  @Get('wallet')
  async getWallet() {
    return {
      balance: 100,
      held_balance: 0,
      currency: 'USD',
      transactions: [
        {
          id: 'tx_1',
          type: 'DEPOSIT',
          amount: 100,
          description: 'Test deposit',
          status: 'COMPLETED',
          created_at: new Date().toISOString()
        }
      ]
    };
  }
}
