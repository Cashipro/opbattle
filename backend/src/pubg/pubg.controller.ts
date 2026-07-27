import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PubgService } from './pubg.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/pubg')
@UseGuards(JwtAuthGuard)
export class PubgController {
  constructor(private readonly pubgService: PubgService) {}

  @Get('search')
  async searchPlayer(@Query('name') name: string) {
    return this.pubgService.searchPlayer(name);
  }

  @Get('player/:id')
  async getPlayer(@Param('id') id: string) {
    return this.pubgService.getPlayerById(id);
  }

  @Get('match/:id')
  async getMatch(@Param('id') id: string) {
    return this.pubgService.getMatch(id);
  }

  @Get('stats/:id')
  async getStats(@Param('id') id: string) {
    return this.pubgService.getPlayerStats(id);
  }
}
