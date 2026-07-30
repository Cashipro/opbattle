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









// TOURNAMENT DETAIL

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

myTournaments(

@CurrentUser() user:any

){


return this.myTournamentsService.getMyTournaments(

user.id

);


}









// PUBG TEAM ROOM

@Get(':id/team-room')

@UseGuards(JwtGuard)

teamRoom(

@Param('id') id:string

){


return this.teamRoomService.getRoom(

id

);


}









// CHANGE TEAM NAME

@Put('team/:teamId/name')

@UseGuards(JwtGuard)

updateTeamName(

@Param('teamId') teamId:string,


@Body() body:any

){


return this.teamRoomService.updateTeamName(

teamId,

body.name

);


}









// SELECT SLOT

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
