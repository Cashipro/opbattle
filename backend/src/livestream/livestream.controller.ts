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
import { LiveStreamService } from './livestream.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/livestream')
export class LiveStreamController {
  constructor(private readonly liveStreamService: LiveStreamService) {}

  // Admin routes
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() body: any) {
    return this.liveStreamService.create(req.user.id, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.liveStreamService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req) {
    return this.liveStreamService.delete(id, req.user.id);
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard)
  async startStream(@Param('id') id: string, @Request() req) {
    return this.liveStreamService.startStream(id, req.user.id);
  }

  @Post(':id/end')
  @UseGuards(JwtAuthGuard)
  async endStream(@Param('id') id: string, @Request() req) {
    return this.liveStreamService.endStream(id, req.user.id);
  }

  @Put(':id/feature')
  @UseGuards(JwtAuthGuard)
  async toggleFeature(@Param('id') id: string, @Request() req) {
    return this.liveStreamService.toggleFeature(id, req.user.id);
  }

  // Public routes
  @Get()
  async findAll(@Query() query: any) {
    return this.liveStreamService.findAll(query);
  }

  @Get('live')
  async getLive() {
    return this.liveStreamService.getLiveStreams();
  }

  @Get('upcoming')
  async getUpcoming() {
    return this.liveStreamService.getUpcomingStreams();
  }

  @Get('featured')
  async getFeatured() {
    return this.liveStreamService.getFeaturedStreams();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.liveStreamService.findById(id);
  }

  @Get('tournament/:tournamentId')
  async findByTournament(@Param('tournamentId') tournamentId: string) {
    return this.liveStreamService.findByTournament(tournamentId);
  }

  @Get('game/:gameId')
  async findByGame(@Param('gameId') gameId: string) {
    return this.liveStreamService.findByGame(gameId);
  }

  @Post(':id/view')
  async incrementViews(@Param('id') id: string) {
    return this.liveStreamService.incrementViews(id);
  }
}
