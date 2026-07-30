import {
Controller,
Get,
Param,
Post,
Body
} from '@nestjs/common';



import {
TeamRoomService
} from './team-room.service';



@Controller('tournaments')

export class TournamentsController {


constructor(

private teamRoomService:TeamRoomService

){}







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







@Post('team/join-slot')

joinSlot(

@Body() body:any

){


return this.teamRoomService.joinSlot(

body.slotId,

body.userId

);


}







@Post('team/leave-slot')

leaveSlot(

@Body() body:any

){

return this.teamRoomService.leaveSlot(

body.slotId

);

}



}
