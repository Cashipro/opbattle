import {
  Controller,
  Get,
  Param,
  Post,
  Body,
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





@Controller('tournaments')

export class TournamentsController {



constructor(

private tournamentsService:TournamentsService,

private joinService:JoinService,

private teamRoomService:TeamRoomService

){}








@Get()

findAll(){


return this.tournamentsService.findAll();


}









@Get(':id')

findOne(

@Param('id') id:string

){


return this.tournamentsService.findOne(id);


}









@Post(':id/join')

joinTournament(

@Param('id') id:string,

@Body() body:any

){



return this.joinService.joinTournament(

body.userId,

id

);



}









@Post(':id/create-teams')

createTeams(

@Param('id') id:string

){



return this.teamRoomService.createTeams(

id

);



}









@Get(':id/room')

getRoom(

@Param('id') id:string

){



return this.teamRoomService.getRoom(

id

);



}




}
