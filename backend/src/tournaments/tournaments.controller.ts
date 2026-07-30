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


private selectSlotService:SelectSlotService

){}









// ALL TOURNAMENTS

@Get()

getTournaments(){

return this.tournamentsService.findAll();

}









// DETAILS

@Get(':id')

getTournament(

@Param('id') id:string

){

return this.tournamentsService.findOne(id);

}









// JOIN TOURNAMENT

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









// MY TOURNAMENTS

@Get('user/my-tournaments')

@UseGuards(JwtGuard)

myTournaments(

@CurrentUser() user:any

){

return this.myTournamentsService.getMyTournaments(

user.id

);

}









// ============================
// PUBG TEAM ROOM
// ============================







// AUTO GENERATE TEAMS

@Post(':id/generate-teams')

generateTeams(

@Param('id') id:string

){

return this.teamRoomService.generateTeams(id);

}









// SHOW TEAM ROOM

@Get(':id/team-room')

teamRoom(

@Param('id') id:string

){

return this.teamRoomService.getRoom(id);

}









// EDIT TEAM NAME

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









// JOIN SLOT

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









// LEAVE SLOT

@Post('team/leave-slot')

@UseGuards(JwtGuard)

leaveSlot(

@Body() body:any

){

return this.teamRoomService.leaveSlot(

body.slotId

);

}






}
