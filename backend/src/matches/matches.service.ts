import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { MatchResult } from './match-result.entity';
import { TournamentsService } from '../tournaments/tournaments.service';
import { TeamsService } from '../teams/teams.service';
import { WalletService } from '../wallet/wallet.service';
import { PlayersService } from '../players/players.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(MatchResult)
    private resultRepository: Repository<MatchResult>,
    private tournamentsService: TournamentsService,
    private teamsService: TeamsService,
    private walletService: WalletService,
    private playersService: PlayersService,
  ) {}

  async create(userId: string, data: any): Promise<Match> {
    const tournament = await this.tournamentsService.findById(data.tournament_id, userId);
    
    if (tournament.status !== 'LIVE' && tournament.status !== 'UPCOMING') {
      throw new BadRequestException('Tournament is not active');
    }

    const matchCount = await this.matchRepository.count({
      where: { tournament_id: data.tournament_id },
    });

    const match = this.matchRepository.create({
      ...data,
      match_number: matchCount + 1,
      status: 'SCHEDULED',
    });

    return await this.matchRepository.save(match) as any;
  }

  async findAll(query: any): Promise<{ matches: Match[]; total: number }> {
    const { page = 1, limit = 20, tournament_id, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (tournament_id) where.tournament_id = tournament_id;
    if (status) where.status = status;

    const [matches, total] = await this.matchRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { match_number: 'ASC' },
      relations: ['results'],
    });

    return { matches, total };
  }

  async findByTournament(tournamentId: string): Promise<Match[]> {
    return await this.matchRepository.find({
      where: { tournament_id: tournamentId },
      order: { match_number: 'ASC' },
      relations: ['results'],
    });
  }

  async findById(id: string): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id },
      relations: ['results', 'tournament'],
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    return match;
  }

  async update(id: string, userId: string, data: any): Promise<Match> {
    const match = await this.findById(id);
    
    const tournament = await this.tournamentsService.findById(match.tournament_id, userId);
    if (tournament.created_by !== userId) {
      throw new ForbiddenException('Only tournament creator can update matches');
    }

    if (match.status === 'COMPLETED') {
      throw new BadRequestException('Cannot update completed match');
    }

    Object.assign(match, data);
    return await this.matchRepository.save(match) as any;
  }

  async delete(id: string, userId: string): Promise<void> {
    const match = await this.findById(id);
    
    const tournament = await this.tournamentsService.findById(match.tournament_id, userId);
    if (tournament.created_by !== userId) {
      throw new ForbiddenException('Only tournament creator can delete matches');
    }

    if (match.status === 'LIVE' || match.status === 'COMPLETED') {
      throw new BadRequestException('Cannot delete active or completed match');
    }

    await this.matchRepository.remove(match);
  }

  async addRoomDetails(id: string, userId: string, data: any): Promise<Match> {
    const match = await this.findById(id);
    
    const tournament = await this.tournamentsService.findById(match.tournament_id, userId);
    if (tournament.created_by !== userId) {
      throw new ForbiddenException('Only tournament creator can add room details');
    }

    match.room_id = data.room_id;
    match.room_password = data.room_password;
    if (data.map_name) match.map_name = data.map_name;
    if (data.perspective) match.perspective = data.perspective;

    return await this.matchRepository.save(match) as any;
  }

  async startMatch(id: string, userId: string): Promise<Match> {
    const match = await this.findById(id);
    
    const tournament = await this.tournamentsService.findById(match.tournament_id, userId);
    if (tournament.created_by !== userId) {
      throw new ForbiddenException('Only tournament creator can start matches');
    }

    if (match.status === 'COMPLETED') {
      throw new BadRequestException('Match already completed');
    }

    if (!match.room_id) {
      throw new BadRequestException('Room details not added');
    }

    match.status = 'LIVE';
    match.started_at = new Date();

    return await this.matchRepository.save(match) as any;
  }

  async completeMatch(id: string, userId: string): Promise<Match> {
    const match = await this.findById(id);
    
    const tournament = await this.tournamentsService.findById(match.tournament_id, userId);
    if (tournament.created_by !== userId) {
      throw new ForbiddenException('Only tournament creator can complete matches');
    }

    if (match.status !== 'LIVE') {
      throw new BadRequestException('Match is not live');
    }

    match.status = 'COMPLETED';
    match.completed_at = new Date();

    return await this.matchRepository.save(match) as any;
  }

  async addResults(id: string, userId: string, results: any[]): Promise<Match> {
    const match = await this.findById(id);
    
    const tournament = await this.tournamentsService.findById(match.tournament_id, userId);
    if (tournament.created_by !== userId) {
      throw new ForbiddenException('Only tournament creator can add results');
    }

    if (match.status !== 'COMPLETED') {
      throw new BadRequestException('Match must be completed first');
    }

    await this.resultRepository.delete({ match_id: id });

    for (const result of results) {
      const matchResult = this.resultRepository.create({
        match_id: id,
        team_id: result.team_id,
        position: result.position,
        kills: result.kills || 0,
        points: result.points || 0,
        prize_amount: result.prize_amount || 0,
        is_winner: result.position === 1,
        verified: false,
      });
      await this.resultRepository.save(matchResult);

      if (result.position === 1) {
        await this.teamsService.updateStats(result.team_id, { wins: 1 });
      } else {
        await this.teamsService.updateStats(result.team_id, { losses: 1 });
      }
    }

    return await this.findById(id);
  }

  async verifyResult(matchId: string, resultId: string, userId: string): Promise<MatchResult> {
    const match = await this.findById(matchId);
    
    const tournament = await this.tournamentsService.findById(match.tournament_id, userId);
    if (tournament.created_by !== userId) {
      throw new ForbiddenException('Only tournament creator can verify results');
    }

    const result = await this.resultRepository.findOne({
      where: { id: resultId, match_id: matchId },
    });

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    result.verified = true;
    result.verified_by = userId;
    result.verified_at = new Date();

    if (result.prize_amount > 0 && result.verified) {
      const team = await this.teamsService.findById(result.team_id);
      const members = team.members || [];
      const prizePerMember = result.prize_amount / members.length;
      
      for (const member of members) {
        await this.walletService.addReward(member.player_id, prizePerMember);
        await this.playersService.addWinnings(member.player_id, prizePerMember);
      }
    }

    return await this.resultRepository.save(result) as any;
  }

  async getResults(matchId: string): Promise<MatchResult[]> {
    const match = await this.findById(matchId);
    return await this.resultRepository.find({
      where: { match_id: matchId },
      order: { position: 'ASC' },
    });
  }

  async getMatchForRoom(matchId: string): Promise<{ room_id: string; room_password: string; teams: any[] }> {
    const match = await this.findById(matchId);

    if (match.status !== 'LIVE' && match.status !== 'SCHEDULED') {
      throw new BadRequestException('Match is not active');
    }

    const registrations = await this.tournamentsService['registrationRepository'].find({
      where: { tournament_id: match.tournament_id, status: 'APPROVED' },
    });

    const teams = await Promise.all(
      registrations.map(async (reg) => {
        const team = await this.teamsService.findById(reg.team_id);
        return {
          team_id: team.id,
          team_name: team.name,
          members: team.members || [],
        };
      }),
    );

    return {
      room_id: match.room_id,
      room_password: match.room_password,
      teams,
    };
  }
}
