import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Player } from '../players/player.entity';
import { Team } from '../teams/team.entity';
import { Tournament } from '../tournaments/tournament.entity';
import { Match } from '../matches/match.entity';
import { Wallet } from '../wallet/wallet.entity';
import { Transaction } from '../wallet/transaction.entity';
import { Withdrawal } from '../wallet/withdrawal.entity';
import { PlayersService } from '../players/players.service';
import { TournamentsService } from '../tournaments/tournaments.service';
import { MatchesService } from '../matches/matches.service';
import { WalletService } from '../wallet/wallet.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Withdrawal)
    private withdrawalRepository: Repository<Withdrawal>,
    private playersService: PlayersService,
    private tournamentsService: TournamentsService,
    private matchesService: MatchesService,
    private walletService: WalletService,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
  ) {}

  // ========== Dashboard ==========
  async getDashboard(adminId: string): Promise<any> {
    // Check if admin
    const admin = await this.usersService.findById(adminId);
    if (admin.role !== 'admin' && admin.role !== 'super_admin') {
      throw new ForbiddenException('Admin access required');
    }

    const [
      totalUsers,
      totalPlayers,
      totalTeams,
      totalTournaments,
      totalMatches,
      totalTransactions,
      pendingWithdrawals,
      pendingVerifications,
      liveTournaments,
    ] = await Promise.all([
      this.userRepository.count({ where: { is_active: true } }),
      this.playerRepository.count({ where: { is_banned: false } }),
      this.teamRepository.count({ where: { is_active: true } }),
      this.tournamentRepository.count({ where: { is_active: true } }),
      this.matchRepository.count(),
      this.transactionRepository.count(),
      this.withdrawalRepository.count({ where: { status: 'PENDING' } }),
      this.playerRepository.count({ where: { verification_status: 'PENDING' } }),
      this.tournamentRepository.count({ where: { status: 'LIVE' } }),
    ]);

    // Recent transactions
    const recentTransactions = await this.transactionRepository.find({
      order: { created_at: 'DESC' },
      take: 10,
    });

    // Recent users
    const recentUsers = await this.userRepository.find({
      order: { created_at: 'DESC' },
      take: 10,
    });

    return {
      stats: {
        totalUsers,
        totalPlayers,
        totalTeams,
        totalTournaments,
        totalMatches,
        totalTransactions,
        pendingWithdrawals,
        pendingVerifications,
        liveTournaments,
      },
      recentTransactions,
      recentUsers,
    };
  }

  async getStats(): Promise<any> {
    const [
      totalUsers,
      totalPlayers,
      totalTeams,
      totalTournaments,
      totalMatches,
      totalRevenue,
      totalPrizes,
    ] = await Promise.all([
      this.userRepository.count({ where: { is_active: true } }),
      this.playerRepository.count({ where: { is_banned: false } }),
      this.teamRepository.count({ where: { is_active: true } }),
      this.tournamentRepository.count({ where: { is_active: true } }),
      this.matchRepository.count(),
      this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where('transaction.type = :type', { type: 'DEPOSIT' })
        .andWhere('transaction.status = :status', { status: 'COMPLETED' })
        .getRawOne(),
      this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where('transaction.type = :type', { type: 'REWARD' })
        .andWhere('transaction.status = :status', { status: 'COMPLETED' })
        .getRawOne(),
    ]);

    return {
      users: totalUsers,
      players: totalPlayers,
      teams: totalTeams,
      tournaments: totalTournaments,
      matches: totalMatches,
      revenue: totalRevenue?.total || 0,
      prizes: totalPrizes?.total || 0,
    };
  }

  // ========== Users ==========
  async getUsers(query: any): Promise<{ users: User[]; total: number }> {
    const { page = 1, limit = 20, search, role } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role) where.role = role;

    const qb = this.userRepository.createQueryBuilder('user');

    if (search) {
      qb.where('user.email ILIKE :search', { search: `%${search}%` });
    }
    if (role) {
      qb.andWhere('user.role = :role', { role });
    }

    const [users, total] = await qb
      .skip(skip)
      .take(limit)
      .orderBy('user.created_at', 'DESC')
      .getManyAndCount();

    return { users, total };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async banUser(id: string, reason: string): Promise<User> {
    const user = await this.getUserById(id);
    user.is_active = false;
    await this.userRepository.save(user);

    // Ban player if exists
    const player = await this.playerRepository.findOne({ where: { user_id: id } });
    if (player) {
      player.is_banned = true;
      player.ban_reason = reason;
      await this.playerRepository.save(player);
    }

    // Notify user
    await this.notificationsService.createNotification({
      user_id: id,
      type: 'ACCOUNT_BANNED',
      title: 'Account Banned ⚠️',
      message: `Your account has been banned. Reason: ${reason}`,
      sendEmail: true,
    });

    return user;
  }

  async unbanUser(id: string): Promise<User> {
    const user = await this.getUserById(id);
    user.is_active = true;
    await this.userRepository.save(user);

    const player = await this.playerRepository.findOne({ where: { user_id: id } });
    if (player) {
      player.is_banned = false;
      player.ban_reason = null;
      await this.playerRepository.save(player);
    }

    await this.notificationsService.createNotification({
      user_id: id,
      type: 'ACCOUNT_UNBANNED',
      title: 'Account Unbanned ✅',
      message: 'Your account has been unbanned.',
      sendEmail: true,
    });

    return user;
  }

  async updateRole(id: string, role: string): Promise<User> {
    const user = await this.getUserById(id);
    user.role = role;
    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
  }

  // ========== Players ==========
  async getPlayers(query: any): Promise<{ players: Player[]; total: number }> {
    const { page = 1, limit = 20, status, search, country } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.verification_status = status;
    if (country) where.country_id = country;

    const qb = this.playerRepository.createQueryBuilder('player');

    if (search) {
      qb.where(
        '(player.player_name ILIKE :search OR player.pubg_uid ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (status) {
      qb.andWhere('player.verification_status = :status', { status });
    }
    if (country) {
      qb.andWhere('player.country_id = :country', { country });
    }

    const [players, total] = await qb
      .skip(skip)
      .take(limit)
      .orderBy('player.created_at', 'DESC')
      .getManyAndCount();

    return { players, total };
  }

  async getPendingVerifications(): Promise<Player[]> {
    return this.playerRepository.find({
      where: { verification_status: 'PENDING' },
      order: { created_at: 'ASC' },
    });
  }

  async getPlayerByUid(uid: string): Promise<Player> {
    return this.playersService.findByUid(uid);
  }

  async verifyPlayer(uid: string, adminId: string, body: any): Promise<Player> {
    const player = await this.playersService.verifyPlayer(uid, adminId, body);

    await this.notificationsService.sendVerificationCompleted(player.user_id, 'APPROVED');

    return player;
  }

  async rejectPlayer(uid: string, adminId: string, reason: string): Promise<Player> {
    const player = await this.playersService.findByUid(uid);
    player.verification_status = 'REJECTED';
    player.verified_by = adminId;
    await this.playerRepository.save(player);

    await this.notificationsService.createNotification({
      user_id: player.user_id,
      type: 'VERIFICATION_REJECTED',
      title: 'Verification Rejected ❌',
      message: `Your profile verification was rejected. Reason: ${reason}`,
      sendEmail: true,
    });

    return player;
  }

  async banPlayer(uid: string, reason: string): Promise<Player> {
    return this.playersService.banPlayer(uid, null, reason);
  }

  async unbanPlayer(uid: string): Promise<Player> {
    return this.playersService.unbanPlayer(uid);
  }

  async updatePlayerStats(uid: string, stats: any): Promise<Player> {
    return this.playersService.updateStats(uid, stats);
  }

  // ========== Tournaments ==========
  async getTournaments(query: any): Promise<{ tournaments: Tournament[]; total: number }> {
    const { page = 1, limit = 20, status, game, country } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (game) where.game_id = game;
    if (country) where.country_id = country;

    const [tournaments, total] = await this.tournamentRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { tournaments, total };
  }

  async getTournamentById(id: string): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({ where: { id } });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    return tournament;
  }

  async updateTournament(id: string, data: any): Promise<Tournament> {
    const tournament = await this.getTournamentById(id);
    Object.assign(tournament, data);
    return this.tournamentRepository.save(tournament);
  }

  async deleteTournament(id: string): Promise<void> {
    const tournament = await this.getTournamentById(id);
    await this.tournamentRepository.remove(tournament);
  }

  // ========== Matches ==========
  async getMatches(query: any): Promise<{ matches: Match[]; total: number }> {
    const { page = 1, limit = 20, tournament_id, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (tournament_id) where.tournament_id = tournament_id;
    if (status) where.status = status;

    const [matches, total] = await this.matchRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { matches, total };
  }

  async getMatchById(id: string): Promise<Match> {
    const match = await this.matchRepository.findOne({ where: { id } });
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return match;
  }

  // ========== Wallet ==========
  async getTransactions(query: any): Promise<{ transactions: Transaction[]; total: number }> {
    const { page = 1, limit = 20, type, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const [transactions, total] = await this.transactionRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { transactions, total };
  }

  async getPendingWithdrawals(): Promise<Withdrawal[]> {
    return this.withdrawalRepository.find({
      where: { status: 'PENDING' },
      order: { created_at: 'ASC' },
    });
  }

  async processWithdrawal(id: string, adminId: string): Promise<Withdrawal> {
    return this.walletService.processWithdrawal(id, adminId);
  }

  async completeWithdrawal(id: string, adminId: string): Promise<Withdrawal> {
    const withdrawal = await this.walletService.completeWithdrawal(id, adminId);

    // Notify user
    await this.notificationsService.sendWithdrawalStatus(withdrawal.user_id, withdrawal);

    return withdrawal;
  }

  async rejectWithdrawal(id: string, adminId: string, reason: string): Promise<Withdrawal> {
    const withdrawal = await this.walletService.rejectWithdrawal(id, adminId, reason);

    // Notify user
    await this.notificationsService.sendWithdrawalStatus(withdrawal.user_id, withdrawal);

    return withdrawal;
  }

  // ========== Reports ==========
  async getFinancialReport(query: any): Promise<any> {
    const { start_date, end_date } = query;

    const qb = this.transactionRepository.createQueryBuilder('transaction');

    if (start_date) {
      qb.andWhere('transaction.created_at >= :start_date', { start_date });
    }
    if (end_date) {
      qb.andWhere('transaction.created_at <= :end_date', { end_date });
    }

    const transactions = await qb.getMany();

    const deposits = transactions
      .filter((t) => t.type === 'DEPOSIT' && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const withdrawals = transactions
      .filter((t) => t.type === 'WITHDRAWAL' && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const rewards = transactions
      .filter((t) => t.type === 'REWARD' && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const fees = transactions
      .filter((t) => t.type === 'FEE' && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      total_deposits: deposits,
      total_withdrawals: withdrawals,
      total_rewards: rewards,
      total_fees: fees,
      net_revenue: deposits - withdrawals - rewards,
      platform_revenue: fees,
      total_transactions: transactions.length,
    };
  }

  async getUserReport(query: any): Promise<any> {
    const { start_date, end_date } = query;

    const qb = this.userRepository.createQueryBuilder('user');

    if (start_date) {
      qb.andWhere('user.created_at >= :start_date', { start_date });
    }
    if (end_date) {
      qb.andWhere('user.created_at <= :end_date', { end_date });
    }

    const users = await qb.getMany();

    return {
      total_users: users.length,
      active_users: users.filter((u) => u.is_active).length,
      verified_users: users.filter((u) => u.is_verified).length,
      admins: users.filter((u) => u.role === 'admin' || u.role === 'super_admin').length,
    };
  }

  async getTournamentReport(query: any): Promise<any> {
    const { start_date, end_date } = query;

    const qb = this.tournamentRepository.createQueryBuilder('tournament');

    if (start_date) {
      qb.andWhere('tournament.created_at >= :start_date', { start_date });
    }
    if (end_date) {
      qb.andWhere('tournament.created_at <= :end_date', { end_date });
    }

    const tournaments = await qb.getMany();

    return {
      total_tournaments: tournaments.length,
      upcoming: tournaments.filter((t) => t.status === 'UPCOMING').length,
      live: tournaments.filter((t) => t.status === 'LIVE').length,
      completed: tournaments.filter((t) => t.status === 'COMPLETED').length,
      cancelled: tournaments.filter((t) => t.status === 'CANCELLED').length,
      total_prize_pool: tournaments.reduce((sum, t) => sum + Number(t.prize_pool), 0),
    };
  }

  async getPlayerReport(query: any): Promise<any> {
    const { start_date, end_date } = query;

    const qb = this.playerRepository.createQueryBuilder('player');

    if (start_date) {
      qb.andWhere('player.created_at >= :start_date', { start_date });
    }
    if (end_date) {
      qb.andWhere('player.created_at <= :end_date', { end_date });
    }

    const players = await qb.getMany();

    return {
      total_players: players.length,
      verified: players.filter((p) => p.verification_status === 'APPROVED').length,
      pending: players.filter((p) => p.verification_status === 'PENDING').length,
      rejected: players.filter((p) => p.verification_status === 'REJECTED').length,
      banned: players.filter((p) => p.is_banned).length,
      total_wins: players.reduce((sum, p) => sum + p.wins, 0),
      total_kills: players.reduce((sum, p) => sum + p.kills, 0),
    };
  }
}
