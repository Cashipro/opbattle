import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Player } from './player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async create(userId: string, data: any): Promise<Player> {
    const existing = await this.playerRepository.findOne({
      where: { user_id: userId },
    });

    if (existing) {
      throw new ConflictException('Player profile already exists');
    }

    if (data.pubg_uid) {
      const uidExists = await this.playerRepository.findOne({
        where: { pubg_uid: data.pubg_uid },
      });
      if (uidExists) {
        throw new ConflictException('PUBG UID already registered');
      }
    }

    const player = this.playerRepository.create({
      user_id: userId,
      ...data,
    });

    return await this.playerRepository.save(player) as any;
  }

  async findByUserId(userId: string): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { user_id: userId },
    });

    if (!player) {
      throw new NotFoundException('Player profile not found');
    }

    return player;
  }

  async findByUid(uid: string): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { pubg_uid: uid },
    });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return player;
  }

  async updateByUserId(userId: string, data: any): Promise<Player> {
    const player = await this.findByUserId(userId);

    if (data.pubg_uid && data.pubg_uid !== player.pubg_uid) {
      const uidExists = await this.playerRepository.findOne({
        where: { pubg_uid: data.pubg_uid },
      });
      if (uidExists) {
        throw new ConflictException('PUBG UID already registered');
      }
    }

    Object.assign(player, data);
    return await this.playerRepository.save(player) as any;
  }

  async findAll(query: any): Promise<{ players: Player[]; total: number }> {
    const { page = 1, limit = 20, status, country } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.verification_status = status;
    if (country) where.country_id = country;

    const [players, total] = await this.playerRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { players, total };
  }

  async search(query: string): Promise<Player[]> {
    return await this.playerRepository.find({
      where: [
        { player_name: Like(`%${query}%`) },
        { pubg_uid: Like(`%${query}%`) },
      ],
      take: 10,
    });
  }

  async verifyPlayer(uid: string, adminId: string, data: any): Promise<Player> {
    const player = await this.findByUid(uid);
    player.verification_status = 'APPROVED';
    player.verified_by = adminId;
    player.verified_at = new Date();
    if (data.screenshot_url) {
      player.verification_screenshot_url = data.screenshot_url;
    }
    if (data.stats) {
      Object.assign(player, data.stats);
    }
    return await this.playerRepository.save(player) as any;
  }

  async banPlayer(uid: string, reason: string): Promise<Player> {
    const player = await this.findByUid(uid);
    player.is_banned = true;
    player.ban_reason = reason;
    return await this.playerRepository.save(player) as any;
  }

  async unbanPlayer(uid: string): Promise<Player> {
    const player = await this.findByUid(uid);
    player.is_banned = false;
    player.ban_reason = null;
    return await this.playerRepository.save(player) as any;
  }

  async updateStats(uid: string, stats: any): Promise<Player> {
    const player = await this.findByUid(uid);
    Object.assign(player, stats);
    return await this.playerRepository.save(player) as any;
  }

  async addWinnings(uid: string, amount: number): Promise<Player> {
    const player = await this.findByUid(uid);
    player.total_winnings = Number(player.total_winnings) + amount;
    return await this.playerRepository.save(player) as any;
  }
}
