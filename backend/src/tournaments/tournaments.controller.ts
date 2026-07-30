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









// TOURNAMENT DETAILS

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









// USER MY TOURNAMENTS

@Get('user/my-tournaments')

@UseGuards(JwtGuard)

myTournaments(

@CurrentUser() user:any

){


return this.myTournamentsService.getMyTournaments(

user.id

);


}









// TEAM ROOM

@Get(':id/team-room')

teamRoom(

@Param('id') id:string

){


return this.teamRoomService.getRoom(id);


}









// CREATE TEAM

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









// SELECT SLOT

@Post('team/select-slot')

@UseGuards(JwtGuard)

selectSlot(

@Body() body:any,


@CurrentUser() user:any

){


return this.selectSlotService.selectSlot(

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
