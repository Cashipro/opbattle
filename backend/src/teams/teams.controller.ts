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
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async create(@Request() req, @Body() body: { name: string }) {
    try {
      return await this.teamsService.create(req.user.id, body);
    } catch (error) {
      return {
        statusCode: error.status || 500,
        message: error.message || 'Internal server error',
        error: error.name || 'Error',
      };
    }
  }

  @Get('my')
  async getMyTeam(@Request() req) {
    try {
      return await this.teamsService.findByPlayerId(req.user.id);
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      return {
        statusCode: error.status || 500,
        message: error.message || 'Internal server error',
        error: error.name || 'Error',
      };
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      return await this.teamsService.findById(id);
    } catch (error) {
      return {
        statusCode: error.status || 500,
        message: error.message || 'Internal server error',
        error: error.name || 'Error',
      };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.teamsService.update(id, req.user.id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.teamsService.delete(id, req.user.id);
  }

  @Post(':id/members')
  async addMember(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { player_id: string },
  ) {
    return this.teamsService.addMember(id, req.user.id, body.player_id);
  }

  @Delete(':id/members/:playerId')
  async removeMember(
    @Param('id') id: string,
    @Param('playerId') playerId: string,
    @Request() req,
  ) {
    return this.teamsService.removeMember(id, req.user.id, playerId);
  }

  @Post(':id/leave')
  async leaveTeam(@Param('id') id: string, @Request() req) {
    return this.teamsService.leaveTeam(id, req.user.id);
  }

  @Put(':id/transfer-captain')
  async transferCaptain(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { new_captain_id: string },
  ) {
    return this.teamsService.transferCaptain(id, req.user.id, body.new_captain_id);
  }

  @Get('top/:limit')
  async getTopTeams(@Param('limit') limit: number) {
    return this.teamsService.getTopTeams(limit);
  }
}
