import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './tournament.entity';
import { TournamentRegistration } from './tournament-registration.entity';
import { TeamsService } from '../teams/teams.service';
import { WalletService } from '../wallet/wallet.service';
import { PlayersService } from '../players/players.service';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentRegistration)
    private registrationRepository: Repository<TournamentRegistration>,
    private teamsService: TeamsService,
    private walletService: WalletService,
    private playersService: PlayersService,
  ) {}

  async create(userId: string, data: any): Promise<Tournament> {
    const tournament = this.tournamentRepository.create({
      ...data,
      created_by: userId,
      status: 'UPCOMING',
    });

    return await this.tournamentRepository.save(tournament);
  }

  async findAll(query: any): Promise<{ tournaments: Tournament[]; total: number }> {
    const { page = 1, limit = 20, game, country, status } = query;
    const skip = (page - 1) * limit;

    const where: any = { is_active: true };
    if (game) where.game_id = game;
    if (country) where.country_id = country;
    if (status) where.status = status;

    const [tournaments, total] = await this.tournamentRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { start_date: 'ASC' },
    });

    return { tournaments, total };
  }

  async findById(id: string, userId?: string): Promise<any> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, is_active: true },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    const registrations = await this.registrationRepository.find({
      where: { tournament_id: id },
    });

    const registeredTeams = await Promise.all(
      registrations.map(async (reg) => {
        const team = await this.teamsService.findById(reg.team_id);
        const members = team.members || [];
        return {
          id: team.id,
          name: team.name,
          members: members.length,
          status: reg.status,
          position: reg.position,
          prize_won: reg.prize_won,
        };
      }),
    );

    let isRegistered = false;
    if (userId) {
      const player = await this.playersService.findByUserId(userId);
      const userTeam = await this.teamsService.findByPlayerId(userId);
      isRegistered = registrations.some((reg) => reg.team_id === userTeam.id);
    }

    const canRegister =
      tournament.status === 'UPCOMING' &&
      new Date() < tournament.registration_deadline &&
      tournament.current_teams < tournament.max_teams;

    return {
      ...tournament,
      registered_teams: registeredTeams,
      is_registered: isRegistered,
      can_register: canRegister,
    };
  }

  async update(id: string, userId: string, data: any): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, is_active: true },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    if (tournament.created_by !== userId) {
      throw new ForbiddenException('Only tournament creator can update');
    }

    if (tournament.status === 'COMPLETED') {
      throw new BadRequestException('Cannot update completed tournament');
    }

    Object.assign(tournament, data);
    return await this.tournamentRepository.save(tournament);
  }

  async delete(id: string, userId: string): Promise<void> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, is_active: true },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    if (tournament.created_by !== userId) {
      throw new ForbiddenException('Only tournament creator can delete');
    }

    tournament.is_active = false;
    await this.tournamentRepository.save(tournament);
  }

  async registerTeam(tournamentId: string, userId: string): Promise<TournamentRegistration> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId, is_active: true },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    if (tournament.status !== 'UPCOMING') {
      throw new BadRequestException('Tournament is not accepting registrations');
    }

    if (new Date() > tournament.registration_deadline) {
      throw new BadRequestException('Registration deadline has passed');
    }

    if (tournament.current_teams >= tournament.max_teams) {
      throw new BadRequestException('Tournament is full');
    }

    const team = await this.teamsService.findByPlayerId(userId);

    const existing = await this.registrationRepository.findOne({
      where: { tournament_id: tournamentId, team_id: team.id },
    });

    if (existing) {
      throw new ConflictException('Team already registered');
    }

    if (tournament.entry_fee > 0) {
      await this.walletService.deductFee(userId, tournament.entry_fee, `Tournament entry: ${tournament.title}`);
    }

    const registration = this.registrationRepository.create({
      tournament_id: tournamentId,
      team_id: team.id,
      entry_fee_paid: tournament.entry_fee,
      payment_status: tournament.entry_fee > 0 ? 'PAID' : 'PENDING',
    });

    await this.registrationRepository.save(registration);

    tournament.current_teams += 1;
    await this.tournamentRepository.save(tournament);

    return registration;
  }

  async approveRegistration(tournamentId: string, registrationId: string, adminId: string): Promise<void> {
    const registration = await this.registrationRepository.findOne({
      where: { id: registrationId, tournament_id: tournamentId },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    registration.status = 'APPROVED';
    registration.approved_by = adminId;
    registration.approved_at = new Date();
    await this.registrationRepository.save(registration);
  }

  async rejectRegistration(tournamentId: string, registrationId: string, adminId: string): Promise<void> {
    const registration = await this.registrationRepository.findOne({
      where: { id: registrationId, tournament_id: tournamentId },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    registration.status = 'REJECTED';
    await this.registrationRepository.save(registration);

    if (registration.entry_fee_paid > 0) {
      const team = await this.teamsService.findById(registration.team_id);
      await this.walletService.refund(team.captain_id, registration.entry_fee_paid);
    }

    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
    });
    if (tournament) {
      tournament.current_teams -= 1;
      await this.tournamentRepository.save(tournament);
    }
  }

  async startTournament(id: string, userId: string): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, is_active: true },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    if (tournament.created_by !== userId) {
      throw new ForbiddenException('Only tournament creator can start');
    }

    if (tournament.current_teams < tournament.min_teams) {
      throw new BadRequestException(`Minimum ${tournament.min_teams} teams required to start`);
    }

    tournament.status = 'LIVE';
    return await this.tournamentRepository.save(tournament);
  }

  async cancelTournament(id: string, userId: string): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, is_active: true },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    if (tournament.created_by !== userId) {
      throw new ForbiddenException('Only tournament creator can cancel');
    }

    tournament.status = 'CANCELLED';
    await this.tournamentRepository.save(tournament);

    const registrations = await this.registrationRepository.find({
      where: { tournament_id: id, status: 'APPROVED' },
    });

    for (const reg of registrations) {
      if (reg.entry_fee_paid > 0) {
        const team = await this.teamsService.findById(reg.team_id);
        await this.walletService.refund(team.captain_id, reg.entry_fee_paid);
      }
    }

    return tournament;
  }

  async getUpcoming(): Promise<Tournament[]> {
    return await this.tournamentRepository.find({
      where: { status: 'UPCOMING', is_active: true },
      order: { start_date: 'ASC' },
      take: 10,
    });
  }

  async getLive(): Promise<Tournament[]> {
    return await this.tournamentRepository.find({
      where: { status: 'LIVE', is_active: true },
      order: { start_date: 'ASC' },
    });
  }

  async getCompleted(): Promise<Tournament[]> {
    return await this.tournamentRepository.find({
      where: { status: 'COMPLETED', is_active: true },
      order: { end_date: 'DESC' },
      take: 10,
    });
  }

  async getMyTournaments(userId: string): Promise<any[]> {
    const player = await this.playersService.findByUserId(userId);
    const team = await this.teamsService.findByPlayerId(userId);

    const registrations = await this.registrationRepository.find({
      where: { team_id: team.id },
    });

    const tournaments = await Promise.all(
      registrations.map(async (reg) => {
        const tournament = await this.tournamentRepository.findOne({
          where: { id: reg.tournament_id },
        });
        return {
          ...tournament,
          registration_status: reg.status,
          position: reg.position,
          prize_won: reg.prize_won,
        };
      }),
    );

    return tournaments;
  }

  async getLeaderboard(tournamentId: string): Promise<any[]> {
    const registrations = await this.registrationRepository.find({
      where: { tournament_id: tournamentId },
      order: { position: 'ASC' },
    });

    const leaderboard = await Promise.all(
      registrations.map(async (reg) => {
        const team = await this.teamsService.findById(reg.team_id);
        return {
          team_name: team.name,
          position: reg.position,
          prize_won: reg.prize_won,
        };
      }),
    );

    return leaderboard;
  }

  async completeTournament(id: string, adminId: string, results: any[]): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, is_active: true },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    for (const result of results) {
      await this.registrationRepository.update(
        { tournament_id: id, team_id: result.team_id },
        {
          position: result.position,
          prize_won: result.prize_amount,
        },
      );

      if (result.prize_amount > 0) {
        const team = await this.teamsService.findById(result.team_id);
        const members = team.members || [];
        const prizePerMember = result.prize_amount / members.length;
        for (const member of members) {
          await this.walletService.addReward(member.player_id, prizePerMember);
          await this.playersService.addWinnings(member.player_id, prizePerMember);
        }
      }
    }

    tournament.status = 'COMPLETED';
    tournament.end_date = new Date();
    return await this.tournamentRepository.save(tournament);
  }
}
