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

  // Admin routes
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() body: any) {
    return this.tournamentsService.create(req.user.id, body);
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

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyTournaments(@Request() req) {
    return this.tournamentsService.getMyTournaments(req.user.id);
  }
}
