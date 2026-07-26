import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import { TeamMember } from './team-member.entity';
import { PlayersService } from '../players/players.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private teamMemberRepository: Repository<TeamMember>,
    private playersService: PlayersService,
  ) {}

  async create(userId: string, data: { name: string; game_id?: string }): Promise<Team> {
    // Check if user already has a team
    const existingMember = await this.teamMemberRepository.findOne({
      where: { player_id: userId, is_active: true },
    });

    if (existingMember) {
      throw new ConflictException('You are already in a team');
    }

    // Get player profile
    const player = await this.playersService.findByUserId(userId);

    // Create team
    const team = this.teamRepository.create({
      name: data.name,
      captain_id: userId,
      game_id: data.game_id,
      country_id: player.country_id,
    });

    await this.teamRepository.save(team);

    // Add captain as member
    const member = this.teamMemberRepository.create({
      team_id: team.id,
      player_id: userId,
      is_captain: true,
      joined_at: new Date(),
    });

    await this.teamMemberRepository.save(member);

    return team;
  }

  async findById(id: string): Promise<any> {
    const team = await this.teamRepository.findOne({
      where: { id, is_active: true },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const members = await this.teamMemberRepository.find({
      where: { team_id: id, is_active: true },
      relations: ['team'],
    });

    const memberDetails = await Promise.all(
      members.map(async (member) => {
        const player = await this.playersService.findByUserId(member.player_id);
        return {
          id: member.id,
          player_id: member.player_id,
          is_captain: member.is_captain,
          joined_at: member.joined_at,
          player_name: player.player_name,
          pubg_uid: player.pubg_uid,
          avatar_url: player.avatar_url,
        };
      }),
    );

    return {
      ...team,
      members: memberDetails,
    };
  }

  async findByPlayerId(userId: string): Promise<any> {
    const member = await this.teamMemberRepository.findOne({
      where: { player_id: userId, is_active: true },
    });

    if (!member) {
      throw new NotFoundException('You are not in a team');
    }

    return this.findById(member.team_id);
  }

  async findAll(query: any): Promise<{ teams: any[]; total: number }> {
    const { page = 1, limit = 20, game, country, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.teamRepository.createQueryBuilder('team')
      .where('team.is_active = :isActive', { isActive: true });

    if (game) {
      qb.andWhere('team.game_id = :game', { game });
    }

    if (country) {
      qb.andWhere('team.country_id = :country', { country });
    }

    if (search) {
      qb.andWhere('team.name ILIKE :search', { search: `%${search}%` });
    }

    const [teams, total] = await qb
      .skip(skip)
      .take(limit)
      .orderBy('team.ranking', 'ASC')
      .getManyAndCount();

    const teamDetails = await Promise.all(
      teams.map(async (team) => {
        const members = await this.teamMemberRepository.count({
          where: { team_id: team.id, is_active: true },
        });
        return { ...team, member_count: members };
      }),
    );

    return { teams: teamDetails, total };
  }

  async search(query: string): Promise<any[]> {
    const teams = await this.teamRepository.find({
      where: [
        { name: query, is_active: true },
      ],
      take: 10,
    });

    return teams;
  }

  async update(id: string, userId: string, data: any): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id, is_active: true },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Only captain can update
    if (team.captain_id !== userId) {
      throw new ForbiddenException('Only captain can update team');
    }

    Object.assign(team, data);
    return this.teamRepository.save(team);
  }

  async delete(id: string, userId: string): Promise<void> {
    const team = await this.teamRepository.findOne({
      where: { id, is_active: true },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Only captain can delete
    if (team.captain_id !== userId) {
      throw new ForbiddenException('Only captain can delete team');
    }

    // Soft delete
    team.is_active = false;
    await this.teamRepository.save(team);

    // Deactivate all members
    await this.teamMemberRepository.update(
      { team_id: id },
      { is_active: false },
    );
  }

  async addMember(teamId: string, captainId: string, playerId: string): Promise<any> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, is_active: true },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Only captain can add members
    if (team.captain_id !== captainId) {
      throw new ForbiddenException('Only captain can add members');
    }

    // Check if player exists and is verified
    const player = await this.playersService.findByUserId(playerId);
    if (player.verification_status !== 'APPROVED') {
      throw new BadRequestException('Player is not verified');
    }

    if (player.is_banned) {
      throw new BadRequestException('Player is banned');
    }

    // Check member count
    const currentMembers = await this.teamMemberRepository.count({
      where: { team_id: teamId, is_active: true },
    });

    if (currentMembers >= team.max_members) {
      throw new BadRequestException('Team is full');
    }

    // Check if player is already in a team
    const existingMember = await this.teamMemberRepository.findOne({
      where: { player_id: playerId, is_active: true },
    });

    if (existingMember) {
      throw new ConflictException('Player is already in a team');
    }

    // Add member
    const member = this.teamMemberRepository.create({
      team_id: teamId,
      player_id: playerId,
      is_captain: false,
      joined_at: new Date(),
    });

    await this.teamMemberRepository.save(member);

    return this.findById(teamId);
  }

  async removeMember(teamId: string, captainId: string, playerId: string): Promise<any> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, is_active: true },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Only captain can remove members
    if (team.captain_id !== captainId) {
      throw new ForbiddenException('Only captain can remove members');
    }

    // Can't remove captain
    if (team.captain_id === playerId) {
      throw new BadRequestException('Cannot remove captain');
    }

    const member = await this.teamMemberRepository.findOne({
      where: { team_id: teamId, player_id: playerId, is_active: true },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    member.is_active = false;
    await this.teamMemberRepository.save(member);

    return this.findById(teamId);
  }

  async leaveTeam(teamId: string, userId: string): Promise<{ message: string }> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, is_active: true },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Captain cannot leave, must transfer captain or delete team
    if (team.captain_id === userId) {
      throw new BadRequestException('Captain cannot leave. Transfer captain or delete team.');
    }

    const member = await this.teamMemberRepository.findOne({
      where: { team_id: teamId, player_id: userId, is_active: true },
    });

    if (!member) {
      throw new NotFoundException('You are not in this team');
    }

    member.is_active = false;
    await this.teamMemberRepository.save(member);

    return { message: 'You left the team' };
  }

  async transferCaptain(teamId: string, currentCaptainId: string, newCaptainId: string): Promise<any> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, is_active: true },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (team.captain_id !== currentCaptainId) {
      throw new ForbiddenException('Only captain can transfer captaincy');
    }

    // Check if new captain is a member
    const member = await this.teamMemberRepository.findOne({
      where: { team_id: teamId, player_id: newCaptainId, is_active: true },
    });

    if (!member) {
      throw new BadRequestException('Player is not a member of this team');
    }

    // Update captain
    team.captain_id = newCaptainId;
    await this.teamRepository.save(team);

    // Update member roles
    await this.teamMemberRepository.update(
      { team_id: teamId, player_id: currentCaptainId },
      { is_captain: false },
    );

    await this.teamMemberRepository.update(
      { team_id: teamId, player_id: newCaptainId },
      { is_captain: true },
    );

    return this.findById(teamId);
  }

  async getTopTeams(limit: number = 10): Promise<Team[]> {
    return this.teamRepository.find({
      where: { is_active: true },
      order: {
        wins: 'DESC',
        total_prize: 'DESC',
        ranking: 'ASC',
      },
      take: limit,
    });
  }

  async updateStats(teamId: string, stats: { wins?: number; losses?: number; prize?: number }): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, is_active: true },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (stats.wins) team.wins += stats.wins;
    if (stats.losses) team.losses += stats.losses;
    if (stats.prize) team.total_prize += stats.prize;

    return this.teamRepository.save(team);
  }
}
