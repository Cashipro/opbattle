import {
Controller,
Get,
Param,
Post,
Body
} from '@nestjs/common';



import {
TournamentsService
} from './tournaments.service';


import {
TeamRoomService
} from './team-room.service';


import {
PlannerService
} from './planner.service';


import {
MatchGeneratorService
} from './match-generator.service';


import {
MatchManagementService
} from './match-management.service';





@Controller('tournaments')

export class TournamentsController {



constructor(


private tournamentsService:TournamentsService,


private teamRoomService:TeamRoomService,


private plannerService:PlannerService,


private matchGeneratorService:MatchGeneratorService,


private matchManagementService:MatchManagementService


){}







@Get()

findAll(){

return this.tournamentsService.findAll();

}








@Post(':id/create-plan')

createPlan(

@Param('id') id:string

){

return this.plannerService.createPlan(id);

}








@Post(':id/generate-matches')

generateMatches(

@Param('id') id:string

){

return this.matchGeneratorService.generateMatches(id);

}








@Get(':id/matches')

matches(

@Param('id') id:string

){

return this.matchManagementService.getMatches(id);

}








@Post('match/update-room')

updateRoom(

@Body() body:any

){


return this.matchManagementService.updateRoom(

body.matchId,

body.room_id,

body.room_password,

body.status

);


}







@Get(':id/room')

room(

@Param('id') id:string

){

return this.teamRoomService.getRoom(id);

}



}
