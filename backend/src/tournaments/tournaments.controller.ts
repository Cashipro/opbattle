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









@Post()

createTournament(

@Body() body:any

){


return this.tournamentsService.create(body);


}









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











// JOIN TOURNAMENT + CREATE ROOM

@Post(':id/join')

@UseGuards(JwtGuard)

async join(

@Param('id') id:string,


@CurrentUser() user:any

){



const result =

await this.joinService.joinTournament(

user.id,

id

);





// AUTO CREATE 100 TEAMS

try{


await this.teamRoomService.generateTeams(id);


}catch(error){


// already created ignore

}







return result;



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



}
