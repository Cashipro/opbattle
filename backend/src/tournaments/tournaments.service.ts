import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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
        try {
          const team = await this.teamsService.findById(reg.team_id);
          return {
            id: team.id,
            name: team.name,
            members: team.members?.length || 0,
            status: reg.status,
            position: reg.position,
            prize_won: reg.prize_won,
          };
        } catch {
          return {
            id: reg.team_id,
            name: 'Unknown Team',
            members: 0,
            status: reg.status,
            position: reg.position,
            prize_won: reg.prize_won,
          };
        }
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

    // ✅ Check if user can join based on mode
    let joinMessage = '';
    let canJoin = true;

    if (tournament.mode === 'SOLO') {
      // ✅ Solo mode: Any player can join directly
      canJoin = true;
      joinMessage = 'Join as solo player';
    } else if (tournament.mode === 'DUO' || tournament.mode === 'SQUAD') {
      // ✅ Team mode: User must have a team
      try {
        const team = await this.teamsService.findByPlayerId(userId);
        const requiredPlayers = tournament.mode === 'DUO' ? 2 : 4;
        if (team.members.length < requiredPlayers) {
          canJoin = false;
          joinMessage = `Need ${requiredPlayers - team.members.length} more players in your team`;
        } else {
          canJoin = true;
          joinMessage = `Join with your team (${team.members.length} players)`;
        }
      } catch {
        canJoin = false;
        joinMessage = 'You need to create or join a team first';
      }
    }

    return {
      ...tournament,
      registered_teams: registeredTeams,
      is_registered: isRegistered,
      can_register: canRegister && canJoin,
      join_message: joinMessage,
    };
  }

  async registerTeam(tournamentId: string, userId: string): Promise<any> {
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

    let teamId: string;
    let teamName: string = 'Solo Player';
    let membersCount: number = 1;

    // ✅ SOLO MODE - Direct player registration
    if (tournament.mode === 'SOLO') {
      // Check if player already registered
      const existing = await this.registrationRepository.findOne({
        where: { tournament_id: tournamentId, team_id: userId },
      });
      if (existing) {
        throw new ConflictException('You are already registered in this tournament');
      }

      // Deduct entry fee
      if (tournament.entry_fee > 0) {
        await this.walletService.deductFee(userId, tournament.entry_fee, `Tournament: ${tournament.title}`);
      }

      // Create registration with user ID as team_id
      const registration = this.registrationRepository.create({
        tournament_id: tournamentId,
        team_id: userId, // Solo player uses user ID as team_id
        entry_fee_paid: tournament.entry_fee,
        payment_status: tournament.entry_fee > 0 ? 'PAID' : 'PENDING',
        status: 'APPROVED',
      });

      await this.registrationRepository.save(registration);

      tournament.current_teams += 1;
      await this.tournamentRepository.save(tournament);

      return {
        message: 'Successfully registered as solo player! 🎉',
        mode: 'SOLO',
      };
    }

    // ✅ TEAM MODE (DUO / SQUAD) - Team required
    let team;
    try {
      team = await this.teamsService.findByPlayerId(userId);
    } catch {
      throw new BadRequestException('You need to create or join a team first');
    }

    if (!team) {
      throw new BadRequestException('You need to create or join a team first');
    }

    const requiredPlayers = tournament.mode === 'DUO' ? 2 : 4;
    if (team.members.length < requiredPlayers) {
      throw new BadRequestException(
        `Your team has ${team.members.length} players. Need ${requiredPlayers - team.members.length} more players.`
      );
    }

    teamId = team.id;
    teamName = team.name;
    membersCount = team.members.length;

    // Check if team already registered
    const existing = await this.registrationRepository.findOne({
      where: { tournament_id: tournamentId, team_id: teamId },
    });
    if (existing) {
      throw new ConflictException('Your team is already registered in this tournament');
    }

    // Deduct entry fee
    if (tournament.entry_fee > 0) {
      await this.walletService.deductFee(userId, tournament.entry_fee, `Tournament: ${tournament.title}`);
    }

    // Create registration
    const registration = this.registrationRepository.create({
      tournament_id: tournamentId,
      team_id: teamId,
      entry_fee_paid: tournament.entry_fee,
      payment_status: tournament.entry_fee > 0 ? 'PAID' : 'PENDING',
      status: 'APPROVED',
    });

    await this.registrationRepository.save(registration);

    tournament.current_teams += 1;
    await this.tournamentRepository.save(tournament);

    return {
      message: `Team "${teamName}" registered successfully! 🎉`,
      mode: tournament.mode,
      team_name: teamName,
      members: membersCount,
    };
  }

  async getMyTournaments(userId: string): Promise<any[]> {
    // Check if user has a team
    let teamId = userId; // Default: solo player

    try {
      const team = await this.teamsService.findByPlayerId(userId);
      teamId = team.id;
    } catch {
      // User is solo, use user ID
    }

    const registrations = await this.registrationRepository.find({
      where: { team_id: teamId },
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
      order: { created_at: 'DESC' },
      take: 10,
    });
  }

  async getLeaderboard(tournamentId: string): Promise<any[]> {
    const registrations = await this.registrationRepository.find({
      where: { tournament_id: tournamentId },
      order: { position: 'ASC' },
    });

    const leaderboard = await Promise.all(
      registrations.map(async (reg) => {
        let teamName = 'Solo Player';
        try {
          const team = await this.teamsService.findById(reg.team_id);
          teamName = team.name;
        } catch {
          // Solo player
          try {
            const player = await this.playersService.findByUserId(reg.team_id);
            teamName = player.player_name || 'Solo Player';
          } catch {
            teamName = 'Unknown Player';
          }
        }
        return {
          team_name: teamName,
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
        // If solo, prize goes to player directly
        if (tournament.mode === 'SOLO') {
          await this.walletService.addReward(result.team_id, result.prize_amount);
        } else {
          // Team mode - distribute to team members
          try {
            const team = await this.teamsService.findById(result.team_id);
            const members = team.members || [];
            const prizePerMember = result.prize_amount / members.length;
            for (const member of members) {
              await this.walletService.addReward(member.player_id, prizePerMember);
            }
          } catch {
            // Solo mode fallback
            await this.walletService.addReward(result.team_id, result.prize_amount);
          }
        }
      }
    }

    tournament.status = 'COMPLETED';
    return await this.tournamentRepository.save(tournament) as any;
  }
}
