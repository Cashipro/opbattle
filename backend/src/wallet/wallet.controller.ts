import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async getWallet(@Request() req) {
    return this.walletService.getWallet(req.user.id);
  }

  @Get('balance')
  async getBalance(@Request() req) {
    return this.walletService.getBalance(req.user.id);
  }

  @Get('transactions')
  async getTransactions(@Request() req, @Query() query: any) {
    return this.walletService.getTransactions(req.user.id, query);
  }

  @Post('deposit')
  async deposit(@Request() req, @Body() body: { amount: number }) {
    return this.walletService.deposit(req.user.id, body.amount);
  }

  @Post('withdraw')
  async withdraw(@Request() req, @Body() body: any) {
    return this.walletService.withdraw(req.user.id, body);
  }

  @Get('withdrawals')
  async getWithdrawals(@Request() req, @Query() query: any) {
    return this.walletService.getWithdrawals(req.user.id, query);
  }

  // Admin routes
  @Put('withdrawals/:id/process')
  async processWithdrawal(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.walletService.processWithdrawal(id, req.user.id);
  }

  @Put('withdrawals/:id/complete')
  async completeWithdrawal(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.walletService.completeWithdrawal(id, req.user.id);
  }

  @Put('withdrawals/:id/reject')
  async rejectWithdrawal(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { reason: string },
  ) {
    return this.walletService.rejectWithdrawal(id, req.user.id, body.reason);
  }

  @Get('admin/transactions')
  async getAllTransactions(@Query() query: any) {
    return this.walletService.getAllTransactions(query);
  }

  @Get('admin/withdrawals/pending')
  async getPendingWithdrawals() {
    return this.walletService.getPendingWithdrawals();
  }
}
