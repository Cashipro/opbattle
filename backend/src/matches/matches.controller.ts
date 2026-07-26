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
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  async create(@Request() req, @Body() body: any) {
    return this.matchesService.create(req.user.id, body);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.matchesService.findAll(query);
  }

  @Get('tournament/:tournamentId')
  async findByTournament(@Param('tournamentId') tournamentId: string) {
    return this.matchesService.findByTournament(tournamentId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.matchesService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.matchesService.update(id, req.user.id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.matchesService.delete(id, req.user.id);
  }

  @Put(':id/room')
  async addRoomDetails(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { room_id: string; room_password: string; map_name?: string; perspective?: string },
  ) {
    return this.matchesService.addRoomDetails(id, req.user.id, body);
  }

  @Post(':id/start')
  async startMatch(@Param('id') id: string, @Request() req) {
    return this.matchesService.startMatch(id, req.user.id);
  }

  @Post(':id/complete')
  async completeMatch(@Param('id') id: string, @Request() req) {
    return this.matchesService.completeMatch(id, req.user.id);
  }

  @Post(':id/results')
  async addResults(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { results: any[] },
  ) {
    return this.matchesService.addResults(id, req.user.id, body.results);
  }

  @Put(':id/verify/:resultId')
  async verifyResult(
    @Param('id') id: string,
    @Param('resultId') resultId: string,
    @Request() req,
  ) {
    return this.matchesService.verifyResult(id, resultId, req.user.id);
  }

  @Get(':id/results')
  async getResults(@Param('id') id: string) {
    return this.matchesService.getResults(id);
  }
}
