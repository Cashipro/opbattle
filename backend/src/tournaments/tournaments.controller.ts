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
SelectSlotService
} from './select-slot.service';


import {
PlannerService
} from './planner.service';


import {
MatchGeneratorService
} from './match-generator.service';





@Controller('tournaments')

export class TournamentsController {



constructor(


private tournamentsService:TournamentsService,


private teamRoomService:TeamRoomService,


private selectSlotService:SelectSlotService,


private plannerService:PlannerService,


private matchGeneratorService:MatchGeneratorService


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







@Get(':id/room')

room(

@Param('id') id:string

){

return this.teamRoomService.getRoom(id);

}







@Post(':id/select-slot')

selectSlot(

@Body() body:any

){


return this.selectSlotService.selectSlot(

body.userId,

body.slotId

);


}



}
