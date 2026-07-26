import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('global')
  async getGlobalLeaderboard(@Query() query: any) {
    return this.leaderboardService.getGlobalLeaderboard(query);
  }

  @Get('country/:countryCode')
  async getCountryLeaderboard(
    @Param('countryCode') countryCode: string,
    @Query() query: any,
  ) {
    return this.leaderboardService.getCountryLeaderboard(countryCode, query);
  }

  @Get('players/top')
  async getTopPlayers(@Query() query: any) {
    return this.leaderboardService.getTopPlayers(query);
  }

  @Get('teams/top')
  async getTopTeams(@Query() query: any) {
    return this.leaderboardService.getTopTeams(query);
  }

  @Get('tournament/:tournamentId')
  async getTournamentLeaderboard(@Param('tournamentId') tournamentId: string) {
    return this.leaderboardService.getTournamentLeaderboard(tournamentId);
  }

  @Get('player/:playerId')
  @UseGuards(JwtAuthGuard)
  async getPlayerRank(@Param('playerId') playerId: string) {
    return this.leaderboardService.getPlayerRank(playerId);
  }

  @Get('games/:gameId')
  async getGameLeaderboard(
    @Param('gameId') gameId: string,
    @Query() query: any,
  ) {
    return this.leaderboardService.getGameLeaderboard(gameId, query);
  }
}
