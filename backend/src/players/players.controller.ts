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
import { PlayersService } from './players.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/players')
@UseGuards(JwtAuthGuard)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

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

  @Put(':uid/verify')
  async verifyPlayer(
    @Param('uid') uid: string,
    @Request() req,
    @Body() body: { screenshot_url?: string; stats?: any },
  ) {
    return this.playersService.verifyPlayer(uid, req.user.id, body);
  }

  @Put(':uid/ban')
  async banPlayer(
    @Param('uid') uid: string,
    @Body() body: { reason: string },
    @Request() req,
  ) {
    return this.playersService.banPlayer(uid, req.user.id, body.reason);
  }

  @Put(':uid/unban')
  async unbanPlayer(@Param('uid') uid: string) {
    return this.playersService.unbanPlayer(uid);
  }

  @Get('top/:limit')
  async getTopPlayers(@Param('limit') limit: number) {
    return this.playersService.getTopPlayers(limit);
  }
}
