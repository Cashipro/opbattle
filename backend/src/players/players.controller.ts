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
    try {
      console.log('🔍 Searching for player:', uid);
      
      // Search player
      const data = await this.pubgService.searchPlayer(uid);
      
      // Check if player exists
      if (!data || !data.data || data.data.length === 0) {
        throw new NotFoundException(`Player "${uid}" not found. Please check the name.`);
      }
      
      const player = data.data[0];
      const playerId = player.id;
      const playerName = player.attributes.name;
      
      console.log('✅ Player found:', playerName, playerId);
      
      // Fetch stats
      let stats = {};
      try {
        const statsData = await this.pubgService.getPlayerStats(playerId);
        if (statsData?.data?.attributes) {
          stats = statsData.data.attributes;
        }
      } catch (statsError) {
        console.log('Stats not available');
      }
      
      return {
        success: true,
        id: playerId,
        name: playerName,
        stats: stats,
      };
      
    } catch (error) {
      console.error('❌ Error:', error);
      throw new NotFoundException(error.message || 'Player not found');
    }
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
