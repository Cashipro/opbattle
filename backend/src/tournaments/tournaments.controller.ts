import {
Controller,
Get,
Post,
Put,
Param,
Body,
UseGuards
} from '@nestjs/common';


import {
TournamentsService
} from './tournaments.service';


import {
JoinService
} from './join.service';


import {
TeamRoomService
} from './team-room.service';


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

private tournamentsService:TournamentsService,

private joinService:JoinService,

private teamRoomService:TeamRoomService,

private myTournamentsService:MyTournamentsService,

private selectSlotService:SelectSlotService

){}









// ALL TOURNAMENTS

@Get()

getAll(){


return this.tournamentsService.findAll();


}









// DETAIL PAGE

@Get(':id')

getOne(

@Param('id') id:string

){


return this.tournamentsService.findOne(id);


}









// JOIN TOURNAMENT

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









// MY TOURNAMENTS

@Get('user/my-tournaments')

@UseGuards(JwtGuard)

myTournament(

@CurrentUser() user:any

){


return this.myTournamentsService.getMyTournaments(

user.id

);


}









// PUBG ROOM

@Get(':id/team-room')

teamRoom(

@Param('id') id:string

){


return this.teamRoomService.getRoom(id);


}









// SELECT PLAYER POSITION

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









// REMOVE POSITION

@Post('team/leave-slot')

@UseGuards(JwtGuard)

leaveSlot(

@Body() body:any

){


return this.teamRoomService.leaveSlot(

body.slotId

);


}









// CHANGE TEAM NAME (ADMIN)

@Put('team/:teamId/name')

updateName(

@Param('teamId') teamId:string,

@Body() body:any

){


return this.teamRoomService.updateTeamName(

teamId,

body.name

);


}









// ADMIN ADD MORE TEAMS

@Post(':id/increase-teams')

increaseTeams(

@Param('id') id:string,

@Body() body:any

){



return this.teamRoomService.increaseTeams(

id,

Number(body.amount || 0)

);


}



}
