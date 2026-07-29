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
JoinService
} from './join.service';


import {
TeamRoomService
} from './team-room.service';


import {
SelectSlotService
} from './select-slot.service';


import {
MyTournamentsService
} from './my-tournaments.service';


import {
PlannerService
} from './planner.service';





@Controller('tournaments')

export class TournamentsController {



constructor(


private tournamentsService:TournamentsService,


private joinService:JoinService,


private teamRoomService:TeamRoomService,


private selectSlotService:SelectSlotService,


private myTournamentsService:MyTournamentsService,


private plannerService:PlannerService


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
