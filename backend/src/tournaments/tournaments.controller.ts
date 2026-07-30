import {
Controller,
Get,
Param,
Post,
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
QualificationService
} from './qualification.service';



import {
NextRoundService
} from './next-round.service';



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

private plannerService:PlannerService,

private matchGeneratorService:MatchGeneratorService,

private matchManagementService:MatchManagementService,

private resultService:ResultService,

private resultBoardService:ResultBoardService,

private qualificationService:QualificationService,

private nextRoundService:NextRoundService

){}








@Get()

getTournaments(){

return this.tournamentsService.findAll();

}









@Get(':id')

getTournament(

@Param('id') id:string

){

return this.tournamentsService.findOne(id);

}









@Post(':id/join')

@UseGuards(JwtGuard)

joinTournament(

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









@Get(':id/team-room')

teamRoom(

@Param('id') id:string

){

return this.teamRoomService.getRoom(id);

}









@Post(':id/create-team')

createTeam(

@Param('id') id:string,

@Body() body:any

){

return this.teamRoomService.createTeam(

id,

body.name

);

}









@Post('team/select-slot')

@UseGuards(JwtGuard)

selectSlot(

@Body() body:any,

@CurrentUser() user:any

){

return this.selectSlotService.selectSlot(

user.id,

body.slotId

);

}









@Post('team/leave-slot')

@UseGuards(JwtGuard)

leaveSlot(

@Body() body:any

){

return this.teamRoomService.leaveSlot(

body.slotId

);

}









// CREATE TOURNAMENT PLAN

@Post(':id/calculate-plan')

calculatePlan(

@Param('id') id:string

){

return this.plannerService.createPlan(id);

}









// GENERATE MATCHES

@Post(':id/generate-matches')

generateMatches(

@Param('id') id:string,

@Body() body:any

){

return this.matchGeneratorService.generateMatches(

id,

body.roundId

);

}









// GET MATCHES

@Get(':id/matches')

getMatches(

@Param('id') id:string

){

return this.matchManagementService.getMatches(id);

}









// ADD ROOM DETAILS

@Post('match/:id/room')

updateRoom(

@Param('id') id:string,

@Body() body:any

){

return this.matchManagementService.updateRoom(

id,

body.room_id,

body.room_password

);

}









// FINISH MATCH

@Post('match/:id/finish')

finishMatch(

@Param('id') id:string

){

return this.matchManagementService.finishMatch(id);

}









// MATCH TEAMS FOR RESULT

@Get('match/:id/result-teams')

getResultTeams(

@Param('id') id:string

){

return this.resultService.getMatchTeams(id);

}









// ADD RESULT

@Post('match/:id/result')

addResult(

@Param('id') id:string,

@Body() body:any

){

return this.resultService.addResult(

id,

body

);

}









// RESULT BOARD

@Get(':id/result-board')

resultBoard(

@Param('id') id:string

){

return this.resultBoardService.tournamentResults(id);

}









// FINAL RESULT

@Get(':id/final-ranking')

finalRanking(

@Param('id') id:string

){

return this.resultBoardService.finalRanking(id);

}









// NEXT ROUND

@Post(':id/next-round')

nextRound(

@Param('id') id:string,

@Body() body:any

){

return this.nextRoundService.generateNextRound(

id,

body.previousRoundId

);

}









}
