import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './tournament.entity';
import { TournamentRegistration } from './tournament-registration.entity';
import { TeamsService } from '../teams/teams.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentRegistration)
    private registrationRepository: Repository<TournamentRegistration>,
    private teamsService: TeamsService,
    private walletService: WalletService,
  ) {}

  async create(userId: string, data: any): Promise<Tournament> {
    const tournament = this.tournamentRepository.create({
      ...data,
      created_by: userId,
      status: 'UPCOMING',
    });
    return await this.tournamentRepository.save(tournament) as any;
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
        return {
          id: team.id,
          name: team.name,
          members: team.members?.length || 0,
          status: reg.status,
          position: reg.position,
          prize_won: reg.prize_won,
        };
      }),
    );

    let isRegistered = false;
    if (userId) {
      try {
        const team = await this.teamsService.findByPlayerId(userId);
        isRegistered = registrations.some((reg) => reg.team_id === team.id);
      } catch {
        // User is not in a team
      }
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

  async registerTeam(tournamentId: string, userId: string): Promise<TournamentRegistration> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId, is_active: true },
    });

    if (!tournament) throw new NotFoundException('Tournament not found');
    if (tournament.status !== 'UPCOMING') throw new BadRequestException('Tournament not accepting registrations');
    if (new Date() > tournament.registration_deadline) throw new BadRequestException('Registration deadline passed');
    if (tournament.current_teams >= tournament.max_teams) throw new BadRequestException('Tournament is full');

    const team = await this.teamsService.findByPlayerId(userId);

    const existing = await this.registrationRepository.findOne({
      where: { tournament_id: tournamentId, team_id: team.id },
    });

    if (existing) throw new ConflictException('Team already registered');

    if (tournament.entry_fee > 0) {
      await this.walletService.deductFee(userId, tournament.entry_fee, `Tournament: ${tournament.title}`);
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

  async getMyTournaments(userId: string): Promise<any[]> {
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
}
