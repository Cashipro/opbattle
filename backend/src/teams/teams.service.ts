import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
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

  async create(userId: string, data: { name: string }): Promise<any> {
    // 1. Check if user already has a team
    const existingMember = await this.teamMemberRepository.findOne({
      where: { player_id: userId, is_active: true },
    });
    if (existingMember) {
      throw new ConflictException('You are already in a team');
    }

    // 2. Get player profile (WITH SAFETY CHECK)
    let player;
    try {
      player = await this.playersService.findByUserId(userId);
    } catch (e) {
      // Agar player profile nahi hai toh profile banane ka error do
      throw new BadRequestException('Please complete your player profile first (Add PUBG UID)');
    }

    if (!player) {
      throw new BadRequestException('Player profile not found. Please update your profile.');
    }

    // 3. Create team
    const team = this.teamRepository.create({
      name: data.name,
      captain_id: userId,
      country_id: player.country_id || null, // Agar country nahi hai toh null
    });

    await this.teamRepository.save(team);

    // 4. Add captain as member
    const member = this.teamMemberRepository.create({
      team_id: team.id,
      player_id: userId,
      is_captain: true,
      joined_at: new Date(),
    });

    await this.teamMemberRepository.save(member);

    return team;
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

  async findById(id: string): Promise<any> {
    const team = await this.teamRepository.findOne({
      where: { id, is_active: true },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const members = await this.teamMemberRepository.find({
      where: { team_id: id, is_active: true },
    });

    const memberDetails = await Promise.all(
      members.map(async (member) => {
        try {
          const player = await this.playersService.findByUserId(member.player_id);
          return {
            id: member.id,
            player_id: member.player_id,
            is_captain: member.is_captain,
            joined_at: member.joined_at,
            player_name: player?.player_name || 'Unknown',
            pubg_uid: player?.pubg_uid || 'N/A',
            avatar_url: player?.avatar_url || null,
          };
        } catch {
          return {
            id: member.id,
            player_id: member.player_id,
            is_captain: member.is_captain,
            joined_at: member.joined_at,
            player_name: 'Unknown',
            pubg_uid: 'N/A',
            avatar_url: null,
          };
        }
      }),
    );

    return {
      ...team,
      members: memberDetails,
    };
  }

  async findAll(query: any): Promise<{ teams: Team[]; total: number }> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [teams, total] = await this.teamRepository.findAndCount({
      where: { is_active: true },
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { teams, total };
  }

  async update(id: string, userId: string, data: any): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id, is_active: true },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

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

    if (team.captain_id !== userId) {
      throw new ForbiddenException('Only captain can delete team');
    }

    team.is_active = false;
    await this.teamRepository.save(team);

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

    if (team.captain_id !== captainId) {
      throw new ForbiddenException('Only captain can add members');
    }

    const currentMembers = await this.teamMemberRepository.count({
      where: { team_id: teamId, is_active: true },
    });

    if (currentMembers >= 4) {
      throw new BadRequestException('Team is full');
    }

    const existingMember = await this.teamMemberRepository.findOne({
      where: { player_id: playerId, is_active: true },
    });

    if (existingMember) {
      throw new ConflictException('Player is already in a team');
    }

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

    if (team.captain_id !== captainId) {
      throw new ForbiddenException('Only captain can remove members');
    }

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

    const member = await this.teamMemberRepository.findOne({
      where: { team_id: teamId, player_id: newCaptainId, is_active: true },
    });

    if (!member) {
      throw new BadRequestException('Player is not a member of this team');
    }

    team.captain_id = newCaptainId;
    await this.teamRepository.save(team);

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
      order: { wins: 'DESC', total_prize: 'DESC' },
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
