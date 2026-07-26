import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ========== Dashboard ==========
  @Get('dashboard')
  async getDashboard(@Request() req) {
    return this.adminService.getDashboard(req.user.id);
  }

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  // ========== Users ==========
  @Get('users')
  async getUsers(@Query() query: any) {
    return this.adminService.getUsers(query);
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id/ban')
  async banUser(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.adminService.banUser(id, body.reason);
  }

  @Put('users/:id/unban')
  async unbanUser(@Param('id') id: string) {
    return this.adminService.unbanUser(id);
  }

  @Put('users/:id/role')
  async updateRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.adminService.updateRole(id, body.role);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // ========== Players ==========
  @Get('players')
  async getPlayers(@Query() query: any) {
    return this.adminService.getPlayers(query);
  }

  @Get('players/pending')
  async getPendingVerifications() {
    return this.adminService.getPendingVerifications();
  }

  @Get('players/:uid')
  async getPlayerByUid(@Param('uid') uid: string) {
    return this.adminService.getPlayerByUid(uid);
  }

  @Put('players/:uid/verify')
  async verifyPlayer(
    @Param('uid') uid: string,
    @Request() req,
    @Body() body: { screenshot_url?: string; stats?: any },
  ) {
    return this.adminService.verifyPlayer(uid, req.user.id, body);
  }

  @Put('players/:uid/reject')
  async rejectPlayer(
    @Param('uid') uid: string,
    @Request() req,
    @Body() body: { reason: string },
  ) {
    return this.adminService.rejectPlayer(uid, req.user.id, body.reason);
  }

  @Put('players/:uid/ban')
  async banPlayer(
    @Param('uid') uid: string,
    @Body() body: { reason: string },
  ) {
    return this.adminService.banPlayer(uid, body.reason);
  }

  @Put('players/:uid/unban')
  async unbanPlayer(@Param('uid') uid: string) {
    return this.adminService.unbanPlayer(uid);
  }

  @Put('players/:uid/stats')
  async updatePlayerStats(@Param('uid') uid: string, @Body() body: any) {
    return this.adminService.updatePlayerStats(uid, body);
  }

  // ========== Tournaments ==========
  @Get('tournaments')
  async getTournaments(@Query() query: any) {
    return this.adminService.getTournaments(query);
  }

  @Get('tournaments/:id')
  async getTournamentById(@Param('id') id: string) {
    return this.adminService.getTournamentById(id);
  }

  @Put('tournaments/:id')
  async updateTournament(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateTournament(id, body);
  }

  @Delete('tournaments/:id')
  async deleteTournament(@Param('id') id: string) {
    return this.adminService.deleteTournament(id);
  }

  // ========== Matches ==========
  @Get('matches')
  async getMatches(@Query() query: any) {
    return this.adminService.getMatches(query);
  }

  @Get('matches/:id')
  async getMatchById(@Param('id') id: string) {
    return this.adminService.getMatchById(id);
  }

  // ========== Wallet ==========
  @Get('wallet/transactions')
  async getTransactions(@Query() query: any) {
    return this.adminService.getTransactions(query);
  }

  @Get('wallet/withdrawals/pending')
  async getPendingWithdrawals() {
    return this.adminService.getPendingWithdrawals();
  }

  @Put('wallet/withdrawals/:id/process')
  async processWithdrawal(@Param('id') id: string, @Request() req) {
    return this.adminService.processWithdrawal(id, req.user.id);
  }

  @Put('wallet/withdrawals/:id/complete')
  async completeWithdrawal(@Param('id') id: string, @Request() req) {
    return this.adminService.completeWithdrawal(id, req.user.id);
  }

  @Put('wallet/withdrawals/:id/reject')
  async rejectWithdrawal(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { reason: string },
  ) {
    return this.adminService.rejectWithdrawal(id, req.user.id, body.reason);
  }

  // ========== Reports ==========
  @Get('reports/financial')
  async getFinancialReport(@Query() query: any) {
    return this.adminService.getFinancialReport(query);
  }

  @Get('reports/users')
  async getUserReport(@Query() query: any) {
    return this.adminService.getUserReport(query);
  }

  @Get('reports/tournaments')
  async getTournamentReport(@Query() query: any) {
    return this.adminService.getTournamentReport(query);
  }

  @Get('reports/players')
  async getPlayerReport(@Query() query: any) {
    return this.adminService.getPlayerReport(query);
  }
}
