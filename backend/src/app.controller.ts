// ========== TOURNAMENT ROUTES ==========

// ✅ CREATE TOURNAMENT (Any logged-in user)
@Post('tournaments')
@HttpCode(HttpStatus.CREATED)
async createTournament(@Body() body: any, @Headers('authorization') auth: string) {
  if (!auth || !auth.startsWith('Bearer ')) {
    return { statusCode: 401, message: 'Unauthorized' };
  }

  // Validate required fields
  if (!body.title || body.title.trim().length < 3) {
    return { statusCode: 400, message: 'Title is required (min 3 characters)' };
  }

  if (!body.start_date) {
    return { statusCode: 400, message: 'Start date is required' };
  }

  if (!body.registration_deadline) {
    return { statusCode: 400, message: 'Registration deadline is required' };
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
    registration_deadline: body.registration_deadline,
    status: 'UPCOMING',
    rules: body.rules || '',
    prize_distribution: body.prize_distribution || '',
    created_by: userId,
    is_active: true,
    created_at: new Date().toISOString(),
    registrations: []
  };

  tournaments.push(newTournament);
  console.log('✅ Tournament created:', newTournament);

  return newTournament;
}
