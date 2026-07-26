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
}
