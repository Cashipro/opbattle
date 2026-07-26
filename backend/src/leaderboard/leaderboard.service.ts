import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard } from './leaderboard.entity';
import { PlayersService } from '../players/players.service';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private leaderboardRepository: Repository<Leaderboard>,
    private playersService: PlayersService,
    private teamsService: TeamsService,
  ) {}

  async getGlobalLeaderboard(query: any): Promise<{ entries: any[]; total: number }> {
    const { page = 1, limit = 20, game_id } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (game_id) where.game_id = game_id;

    const [entries, total] = await this.leaderboardRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        ranking: 'ASC',
        total_points: 'DESC',
      },
    });

    // Get player details for each entry
    const entriesWithDetails = await Promise.all(
      entries.map(async (entry) => {
        try {
          const player = await this.playersService.findByUserId(entry.player_id);
          return {
            ...entry,
            player_name: player.player_name,
            pubg_uid: player.pubg_uid,
            avatar_url: player.avatar_url,
            country: player.country_id,
          };
        } catch {
          return {
            ...entry,
            player_name: 'Unknown Player',
            pubg_uid: 'N/A',
            avatar_url: null,
            country: null,
          };
        }
      }),
    );

    return { entries: entriesWithDetails, total };
  }

  async getCountryLeaderboard(countryCode: string, query: any): Promise<{ entries: any[]; total: number }> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [entries, total] = await this.leaderboardRepository.findAndCount({
      where: { country_id: countryCode },
      skip,
      take: limit,
      order: {
        ranking: 'ASC',
        total_points: 'DESC',
      },
    });

    const entriesWithDetails = await Promise.all(
      entries.map(async (entry) => {
        try {
          const player = await this.playersService.findByUserId(entry.player_id);
          return {
            ...entry,
            player_name: player.player_name,
            pubg_uid: player.pubg_uid,
            avatar_url: player.avatar_url,
          };
        } catch {
          return {
            ...entry,
            player_name: 'Unknown Player',
            pubg_uid: 'N/A',
            avatar_url: null,
          };
        }
      }),
    );

    return { entries: entriesWithDetails, total };
  }

  async getTopPlayers(query: any): Promise<any[]> {
    const { limit = 10, country, game } = query;

    const where: any = {};
    if (country) where.country_id = country;
    if (game) where.game_id = game;

    const entries = await this.leaderboardRepository.find({
      where,
      order: {
        total_points: 'DESC',
        wins: 'DESC',
      },
      take: Math.min(limit, 50),
    });

    const playersWithDetails = await Promise.all(
      entries.map(async (entry) => {
        try {
          const player = await this.playersService.findByUserId(entry.player_id);
          return {
            ...entry,
            player_name: player.player_name,
            pubg_uid: player.pubg_uid,
            avatar_url: player.avatar_url,
            level: player.level,
            rank: player.rank,
            season_tier: player.season_tier,
          };
        } catch {
          return {
            ...entry,
            player_name: 'Unknown Player',
            pubg_uid: 'N/A',
            avatar_url: null,
            level: 0,
            rank: 'N/A',
            season_tier: 'N/A',
          };
        }
      }),
    );

    return playersWithDetails;
  }

  async getTopTeams(query: any): Promise<any[]> {
    const { limit = 10, country, game } = query;

    const teams = await this.teamsService.findAll({
      limit: Math.min(limit, 50),
      country,
      game,
    });

    return teams.teams.map((team: any) => ({
      ...team,
      member_count: team.member_count || 0,
      win_rate: team.wins + team.losses > 0 
        ? Number((team.wins / (team.wins + team.losses) * 100).toFixed(1))
        : 0,
    }));
  }

  async getTournamentLeaderboard(tournamentId: string): Promise<any[]> {
    // This will be implemented when we have tournament results
    // For now, return mock data or empty array
    return [];
  }

  async getPlayerRank(playerId: string): Promise<any> {
    const entry = await this.leaderboardRepository.findOne({
      where: { player_id: playerId },
    });

    if (!entry) {
      throw new NotFoundException('Player not found in leaderboard');
    }

    const totalPlayers = await this.leaderboardRepository.count();
    const higherRanked = await this.leaderboardRepository.count({
      where: { total_points: entry.total_points },
    });

    const player = await this.playersService.findByUserId(playerId);

    return {
      ...entry,
      player_name: player.player_name,
      pubg_uid: player.pubg_uid,
      avatar_url: player.avatar_url,
      total_players: totalPlayers,
      percentile: totalPlayers > 0 
        ? Number(((1 - (entry.ranking - 1) / totalPlayers) * 100).toFixed(1))
        : 0,
    };
  }

  async getGameLeaderboard(gameId: string, query: any): Promise<{ entries: any[]; total: number }> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [entries, total] = await this.leaderboardRepository.findAndCount({
      where: { game_id: gameId },
      skip,
      take: limit,
      order: {
        ranking: 'ASC',
        total_points: 'DESC',
      },
    });

    const entriesWithDetails = await Promise.all(
      entries.map(async (entry) => {
        try {
          const player = await this.playersService.findByUserId(entry.player_id);
          return {
            ...entry,
            player_name: player.player_name,
            pubg_uid: player.pubg_uid,
            avatar_url: player.avatar_url,
            country: player.country_id,
          };
        } catch {
          return {
            ...entry,
            player_name: 'Unknown Player',
            pubg_uid: 'N/A',
            avatar_url: null,
            country: null,
          };
        }
      }),
    );

    return { entries: entriesWithDetails, total };
  }

  async updatePlayerStats(playerId: string, stats: any): Promise<void> {
    let entry = await this.leaderboardRepository.findOne({
      where: { player_id: playerId },
    });

    if (!entry) {
      entry = this.leaderboardRepository.create({
        player_id: playerId,
        country_id: stats.country_id,
        game_id: stats.game_id,
      });
    }

    // Update stats
    if (stats.matches_played) entry.matches_played += stats.matches_played;
    if (stats.wins) entry.wins += stats.wins;
    if (stats.kills) entry.kills += stats.kills;
    if (stats.kd_ratio) entry.kd_ratio = stats.kd_ratio;
    if (stats.total_winnings) entry.total_winnings += stats.total_winnings;
    if (stats.tournaments_won) entry.tournaments_won += stats.tournaments_won;

    // Calculate points (custom formula)
    entry.total_points = 
      (entry.wins * 100) +
      (entry.kills * 2) +
      (entry.total_winnings * 0.5) +
      (entry.tournaments_won * 50);

    entry.last_updated = new Date();

    await this.leaderboardRepository.save(entry);

    // Update ranking (run after all updates)
    await this.updateRankings();
  }

  async updateRankings(): Promise<void> {
    const entries = await this.leaderboardRepository.find({
      order: {
        total_points: 'DESC',
        wins: 'DESC',
      },
    });

    for (let i = 0; i < entries.length; i++) {
      entries[i].ranking = i + 1;
      await this.leaderboardRepository.save(entries[i]);
    }
  }

  async calculatePlayerStats(playerId: string): Promise<any> {
    // This will be implemented when we have match results
    // For now, return empty stats
    return {};
  }

  async getLeaderboardStats(): Promise<any> {
    const totalPlayers = await this.leaderboardRepository.count();
    const topPlayer = await this.leaderboardRepository.findOne({
      order: { total_points: 'DESC' },
    });

    return {
      total_players: totalPlayers,
      top_player: topPlayer,
      total_winnings: await this.leaderboardRepository
        .createQueryBuilder('leaderboard')
        .select('SUM(leaderboard.total_winnings)', 'total')
        .getRawOne(),
    };
  }
}
