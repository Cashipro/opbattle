import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';
import { Withdrawal } from './withdrawal.entity';
import { UsersService } from '../users/users.service';
import { PlayersService } from '../players/players.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Withdrawal)
    private withdrawalRepository: Repository<Withdrawal>,
    private usersService: UsersService,
    private playersService: PlayersService,
  ) {}

  async getWallet(userId: string): Promise<Wallet> {
    let wallet = await this.walletRepository.findOne({
      where: { user_id: userId },
    });

    if (!wallet) {
      wallet = await this.createWallet(userId);
    }

    const transactions = await this.transactionRepository.find({
      where: { wallet_id: wallet.id },
      order: { created_at: 'DESC' },
      take: 50,
    });

    return {
      ...wallet,
      transactions,
    } as any;
  }

  async createWallet(userId: string): Promise<Wallet> {
    const existing = await this.walletRepository.findOne({
      where: { user_id: userId },
    });

    if (existing) {
      return existing;
    }

    const wallet = this.walletRepository.create({
      user_id: userId,
      balance: 0,
      held_balance: 0,
    });

    return this.walletRepository.save(wallet);
  }

  async getBalance(userId: string): Promise<{ balance: number; held_balance: number }> {
    const wallet = await this.walletRepository.findOne({
      where: { user_id: userId },
    });

    if (!wallet) {
      return { balance: 0, held_balance: 0 };
    }

    return {
      balance: Number(wallet.balance),
      held_balance: Number(wallet.held_balance),
    };
  }

  async deposit(userId: string, amount: number): Promise<{ transaction: Transaction; payment_url?: string }> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const wallet = await this.getWallet(userId);
    const user = await this.usersService.findById(userId);

    // For now, just add to balance (no real payment gateway integration)
    // In production, integrate with Stripe/JazzCash/bKash here
    wallet.balance = parseFloat((Number(wallet.balance) + amount).toFixed(2));
    await this.walletRepository.save(wallet);

    const transaction = this.transactionRepository.create({
      wallet_id: wallet.id,
      type: 'DEPOSIT',
      amount: amount,
      description: `Deposit of $${amount}`,
      status: 'COMPLETED',
      completed_at: new Date(),
    });

    await this.transactionRepository.save(transaction);

    return {
      transaction,
      // payment_url would be returned from payment gateway
    };
  }

  async withdraw(userId: string, data: any): Promise<Withdrawal> {
    const { amount, bank_name, account_number, account_holder_name, bank_code } = data;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const wallet = await this.getWallet(userId);
    const player = await this.playersService.findByUserId(userId);

    // Check if player is verified
    if (player.verification_status !== 'APPROVED') {
      throw new ForbiddenException('Player must be verified to withdraw');
    }

    // Check balance
    if (Number(wallet.balance) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Minimum withdrawal
    if (amount < 5) {
      throw new BadRequestException('Minimum withdrawal is $5');
    }

    // Hold the amount
    wallet.balance = parseFloat((Number(wallet.balance) - amount).toFixed(2));
    await this.walletRepository.save(wallet);

    const withdrawal = this.withdrawalRepository.create({
      user_id: userId,
      amount,
      bank_name,
      account_number,
      account_holder_name,
      bank_code,
      status: 'PENDING',
    });

    await this.withdrawalRepository.save(withdrawal);

    // Create transaction record
    const transaction = this.transactionRepository.create({
      wallet_id: wallet.id,
      type: 'WITHDRAWAL',
      amount: amount,
      description: `Withdrawal to ${bank_name}`,
      status: 'PENDING',
      reference_id: withdrawal.id,
    });

    await this.transactionRepository.save(transaction);

    return withdrawal;
  }

  async getTransactions(userId: string, query: any): Promise<{ transactions: Transaction[]; total: number }> {
    const { page = 1, limit = 20, type } = query;
    const skip = (page - 1) * limit;

    const wallet = await this.walletRepository.findOne({
      where: { user_id: userId },
    });

    if (!wallet) {
      return { transactions: [], total: 0 };
    }

    const where: any = { wallet_id: wallet.id };
    if (type) where.type = type;

    const [transactions, total] = await this.transactionRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { transactions, total };
  }

  async getWithdrawals(userId: string, query: any): Promise<{ withdrawals: Withdrawal[]; total: number }> {
    const { page = 1, limit = 20, status } = query;
    const skip = (page - 1) * limit;

    const where: any = { user_id: userId };
    if (status) where.status = status;

    const [withdrawals, total] = await this.withdrawalRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { withdrawals, total };
  }

  async processWithdrawal(id: string, adminId: string): Promise<Withdrawal> {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    if (withdrawal.status !== 'PENDING') {
      throw new BadRequestException('Withdrawal is not pending');
    }

    withdrawal.status = 'PROCESSING';
    withdrawal.processed_by = adminId;

    return this.withdrawalRepository.save(withdrawal);
  }

  async completeWithdrawal(id: string, adminId: string): Promise<Withdrawal> {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    if (withdrawal.status !== 'PROCESSING') {
      throw new BadRequestException('Withdrawal is not processing');
    }

    withdrawal.status = 'COMPLETED';
    withdrawal.processed_by = adminId;
    withdrawal.processed_at = new Date();

    // Update transaction
    const transaction = await this.transactionRepository.findOne({
      where: { reference_id: withdrawal.id },
    });

    if (transaction) {
      transaction.status = 'COMPLETED';
      transaction.completed_at = new Date();
      await this.transactionRepository.save(transaction);
    }

    return this.withdrawalRepository.save(withdrawal);
  }

  async rejectWithdrawal(id: string, adminId: string, reason: string): Promise<Withdrawal> {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    if (withdrawal.status !== 'PENDING' && withdrawal.status !== 'PROCESSING') {
      throw new BadRequestException('Cannot reject this withdrawal');
    }

    withdrawal.status = 'REJECTED';
    withdrawal.rejected_reason = reason;
    withdrawal.processed_by = adminId;

    await this.withdrawalRepository.save(withdrawal);

    // Refund the amount
    const wallet = await this.walletRepository.findOne({
      where: { user_id: withdrawal.user_id },
    });

    if (wallet) {
      wallet.balance = parseFloat((Number(wallet.balance) + Number(withdrawal.amount)).toFixed(2));
      await this.walletRepository.save(wallet);

      // Create refund transaction
      const refund = this.transactionRepository.create({
        wallet_id: wallet.id,
        type: 'REFUND',
        amount: withdrawal.amount,
        description: `Refund for rejected withdrawal #${withdrawal.id}`,
        status: 'COMPLETED',
        completed_at: new Date(),
      });
      await this.transactionRepository.save(refund);
    }

    return withdrawal;
  }

  async deductFee(userId: string, amount: number, description: string): Promise<void> {
    const wallet = await this.walletRepository.findOne({
      where: { user_id: userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (Number(wallet.balance) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    wallet.balance = parseFloat((Number(wallet.balance) - amount).toFixed(2));
    wallet.held_balance = parseFloat((Number(wallet.held_balance) + amount).toFixed(2));
    await this.walletRepository.save(wallet);

    const transaction = this.transactionRepository.create({
      wallet_id: wallet.id,
      type: 'FEE',
      amount: amount,
      description,
      status: 'COMPLETED',
      completed_at: new Date(),
    });

    await this.transactionRepository.save(transaction);
  }

  async addReward(userId: string, amount: number): Promise<void> {
    const wallet = await this.walletRepository.findOne({
      where: { user_id: userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    wallet.balance = parseFloat((Number(wallet.balance) + amount).toFixed(2));
    await this.walletRepository.save(wallet);

    const transaction = this.transactionRepository.create({
      wallet_id: wallet.id,
      type: 'REWARD',
      amount: amount,
      description: `Prize reward: $${amount}`,
      status: 'COMPLETED',
      completed_at: new Date(),
    });

    await this.transactionRepository.save(transaction);
  }

  async refund(userId: string, amount: number): Promise<void> {
    const wallet = await this.walletRepository.findOne({
      where: { user_id: userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    wallet.balance = parseFloat((Number(wallet.balance) + amount).toFixed(2));
    wallet.held_balance = parseFloat((Number(wallet.held_balance) - amount).toFixed(2));
    await this.walletRepository.save(wallet);

    const transaction = this.transactionRepository.create({
      wallet_id: wallet.id,
      type: 'REFUND',
      amount: amount,
      description: `Refund: $${amount}`,
      status: 'COMPLETED',
      completed_at: new Date(),
    });

    await this.transactionRepository.save(transaction);
  }

  async releaseHeldBalance(userId: string, amount: number): Promise<void> {
    const wallet = await this.walletRepository.findOne({
      where: { user_id: userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    wallet.held_balance = parseFloat((Number(wallet.held_balance) - amount).toFixed(2));
    await this.walletRepository.save(wallet);
  }

  async getAllTransactions(query: any): Promise<{ transactions: Transaction[]; total: number }> {
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
      relations: ['wallet'],
    });

    return { transactions, total };
  }

  async getPendingWithdrawals(): Promise<Withdrawal[]> {
    return this.withdrawalRepository.find({
      where: { status: 'PENDING' },
      order: { created_at: 'ASC' },
    });
  }
}
