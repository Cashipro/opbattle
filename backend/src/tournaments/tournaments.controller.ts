import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  // Admin routes (no guard for now, will add role guard later)
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() body: any) {
    return this.tournamentsService.create(req.user.id, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.tournamentsService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req) {
    return this.tournamentsService.delete(id, req.user.id);
  }

  // Public routes
  @Get()
  async findAll(@Query() query: any) {
    return this.tournamentsService.findAll(query);
  }

  @Get('upcoming')
  async getUpcoming() {
    return this.tournamentsService.getUpcoming();
  }

  @Get('live')
  async getLive() {
    return this.tournamentsService.getLive();
  }

  @Get('completed')
  async getCompleted() {
    return this.tournamentsService.getCompleted();
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.tournamentsService.findById(id, userId);
  }

  // Registration
  @Post(':id/register')
  @UseGuards(JwtAuthGuard)
  async register(@Param('id') id: string, @Request() req) {
    return this.tournamentsService.registerTeam(id, req.user.id);
  }

  @Put(':id/approve/:registrationId')
  @UseGuards(JwtAuthGuard)
  async approveRegistration(
    @Param('id') id: string,
    @Param('registrationId') registrationId: string,
    @Request() req,
  ) {
    return this.tournamentsService.approveRegistration(id, registrationId, req.user.id);
  }

  @Put(':id/reject/:registrationId')
  @UseGuards(JwtAuthGuard)
  async rejectRegistration(
    @Param('id') id: string,
    @Param('registrationId') registrationId: string,
    @Request() req,
  ) {
    return this.tournamentsService.rejectRegistration(id, registrationId, req.user.id);
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard)
  async startTournament(@Param('id') id: string, @Request() req) {
    return this.tournamentsService.startTournament(id, req.user.id);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelTournament(@Param('id') id: string, @Request() req) {
    return this.tournamentsService.cancelTournament(id, req.user.id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyTournaments(@Request() req) {
    return this.tournamentsService.getMyTournaments(req.user.id);
  }

  @Get(':id/leaderboard')
  async getLeaderboard(@Param('id') id: string) {
    return this.tournamentsService.getLeaderboard(id);
  }
}
