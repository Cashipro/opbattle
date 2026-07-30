import {
Controller,
Get,
Param,
Post,
Put,
Body,
UseGuards
} from '@nestjs/common';


import {
TeamRoomService
} from './team-room.service';


import {
JoinService
} from './join.service';


import {
TournamentsService
} from './tournaments.service';


import {
MyTournamentsService
} from './my-tournaments.service';


import {
SelectSlotService
} from './select-slot.service';


import {
AutoPlannerService
} from './auto-planner.service';


import {
PlannerService
} from './planner.service';


import {
MatchGeneratorService
} from './match-generator.service';


import {
MatchManagementService
} from './match-management.service';


import {
ResultService
} from './result.service';


import {
ResultBoardService
} from './result-board.service';


import {
NextRoundService
} from './next-round.service';


import {
QualificationService
} from './qualification.service';


import {
JwtGuard
} from '../auth/jwt.guard';


import {
CurrentUser
} from '../auth/current-user.decorator';





@Controller('tournaments')

export class TournamentsController {



constructor(

private teamRoomService:TeamRoomService,

private joinService:JoinService,

private tournamentsService:TournamentsService,

private myTournamentsService:MyTournamentsService,

private selectSlotService:SelectSlotService,

private autoPlannerService:AutoPlannerService,

private plannerService:PlannerService,

private matchGeneratorService:MatchGeneratorService,

private matchManagementService:MatchManagementService,

private resultService:ResultService,

private resultBoardService:ResultBoardService,

private nextRoundService:NextRoundService,

private qualificationService:QualificationService

){}







@Get()

getAll(){

return this.tournamentsService.findAll();

}







@Get(':id')

getOne(

@Param('id') id:string

){

return this.tournamentsService.findOne(id);

}







@Post(':id/join')

@UseGuards(JwtGuard)

join(

@Param('id') id:string,

@CurrentUser() user:any

){

return this.joinService.joinTournament(

user.id,

id

);

}







@Get('user/my-tournaments')

@UseGuards(JwtGuard)

myTournaments(

@CurrentUser() user:any

){

return this.myTournamentsService.getMyTournaments(

user.id

);

}







// ======================
// TEAM ROOM
// ======================


@Post(':id/generate-teams')

generateTeams(

@Param('id') id:string

){

return this.teamRoomService.generateTeams(id);

}







@Get(':id/team-room')

teamRoom(

@Param('id') id:string

){

return this.teamRoomService.getRoom(id);

}







@Put('team/:teamId/name')

updateTeamName(

@Param('teamId') teamId:string,

@Body() body:any

){

return this.teamRoomService.updateTeamName(

teamId,

body.name

);

}







@Post('team/join-slot')

@UseGuards(JwtGuard)

joinSlot(

@Body() body:any,

@CurrentUser() user:any

){

return this.teamRoomService.joinSlot(

body.slotId,

user.id

);

}







@Post('team/leave-slot')

leaveSlot(

@Body() body:any

){

return this.teamRoomService.leaveSlot(

body.slotId

);

}







// ======================
// PLANNER
// ======================


@Post(':id/auto-plan')

autoPlan(

@Param('id') id:string

){

return this.autoPlannerService.calculatePlan(id);

}







@Post(':id/plan')

plan(

@Param('id') id:string

){

return this.plannerService.createPlan(id);

}







// ======================
// MATCHES
// ======================


@Post(':id/generate-matches/:roundId')

generateMatches(

@Param('id') id:string,

@Param('roundId') roundId:string

){

return this.matchGeneratorService.generateMatches(

id,

roundId

);

}







@Get(':id/matches')

matches(

@Param('id') id:string

){

return this.matchManagementService.getMatches(id);

}







@Get('match/:matchId')

getMatch(

@Param('matchId') matchId:string

){

return this.matchManagementService.getMatch(matchId);

}







@Put('match/:matchId/room')

updateRoom(

@Param('matchId') matchId:string,

@Body() body:any

){

return this.matchManagementService.updateRoom(

matchId,

body.room_id,

body.room_password

);

}







@Put('match/:matchId/start')

startMatch(

@Param('matchId') matchId:string

){

return this.matchManagementService.startMatch(matchId);

}







@Put('match/:matchId/finish')

finishMatch(

@Param('matchId') matchId:string

){

return this.matchManagementService.finishMatch(matchId);

}







// ======================
// RESULTS
// ======================


@Get('match/:matchId/teams')

matchTeams(

@Param('matchId') matchId:string

){

return this.resultService.getMatchTeams(matchId);

}







@Post('match/:matchId/result')

addResult(

@Param('matchId') matchId:string,

@Body() body:any

){

return this.resultService.addResult(

matchId,

body

);

}







@Get(':id/ranking')

ranking(

@Param('id') id:string

){

return this.resultBoardService.finalRanking(id);

}







@Get(':id/results')

results(

@Param('id') id:string

){

return this.resultBoardService.tournamentResults(id);

}







// ======================
// NEXT ROUND
// ======================


@Post(':id/next-round/:roundId')

nextRound(

@Param('id') id:string,

@Param('roundId') roundId:string

){

return this.nextRoundService.generateNextRound(

id,

roundId

);

}







@Get('match/:matchId/qualified')

qualified(

@Param('matchId') matchId:string

){

return this.qualificationService.getQualifiedTeams(

matchId,

10

);

}



}
