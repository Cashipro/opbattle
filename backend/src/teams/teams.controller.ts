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
    return this.teamsService.create(req.user.id, body);
  }

  @Get('my')
  async getMyTeam(@Request() req) {
    return this.teamsService.findByPlayerId(req.user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.teamsService.findById(id);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.teamsService.findAll(query);
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
    @Body() body: { pubg_uid: string },
  ) {
    return this.teamsService.addMemberByUid(id, req.user.id, body.pubg_uid);
  }

  @Delete(':id/members/:memberId')
  async removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Request() req,
  ) {
    return this.teamsService.removeMemberByUid(id, req.user.id, memberId);
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
