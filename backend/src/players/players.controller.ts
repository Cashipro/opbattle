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
  NotFoundException,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { PubgService } from '../pubg/pubg.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/players')
@UseGuards(JwtAuthGuard)
export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
    private readonly pubgService: PubgService,
  ) {}

  @Post()
  async create(@Request() req, @Body() body: any) {
    return this.playersService.create(req.user.id, body);
  }

  @Get('me')
  async getMyPlayer(@Request() req) {
    return this.playersService.findByUserId(req.user.id);
  }

  @Put('me')
  async updateMyPlayer(@Request() req, @Body() body: any) {
    return this.playersService.updateByUserId(req.user.id, body);
  }

  @Get('pubg/:uid')
  async getPubgData(@Param('uid') uid: string) {
    // Search player by name/UID
    const data = await this.pubgService.searchPlayer(uid);
    
    if (data.errors) {
      throw new NotFoundException('Player not found. Please check the name/UID.');
    }
    
    if (!data.data || data.data.length === 0) {
      throw new NotFoundException('No player found with this name/UID.');
    }
    
    const player = data.data[0];
    const playerId = player.id;
    const playerName = player.attributes.name;
    
    // Fetch player stats
    let stats = {};
    try {
      const statsData = await this.pubgService.getPlayerStats(playerId);
      if (statsData.data && statsData.data.attributes) {
        stats = statsData.data.attributes;
      }
    } catch (error) {
      console.log('Stats not available for this player');
    }
    
    return {
      id: playerId,
      name: playerName,
      stats: stats,
    };
  }

  @Get(':uid')
  async findByUid(@Param('uid') uid: string) {
    return this.playersService.findByUid(uid);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.playersService.findAll(query);
  }

  @Get('search/:query')
  async search(@Param('query') query: string) {
    return this.playersService.search(query);
  }
}
