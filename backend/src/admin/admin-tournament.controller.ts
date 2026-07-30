import {
Controller,
Get,
Post,
Param,
Body
} from '@nestjs/common';



import {
AdminTournamentService
} from './admin-tournament.service';






@Controller('admin/tournaments')

export class AdminTournamentController {



constructor(

private service:AdminTournamentService

){}







@Post()

create(

@Body() body:any

){

return this.service.createTournament(body);

}








@Get()

all(){

return this.service.allTournaments();

}








@Post(':id/close')

close(

@Param('id') id:string

){

return this.service.closeEntries(id);

}








@Get(':id/teams')

teams(

@Param('id') id:string

){

return this.service.getTournamentTeams(id);

}








@Post('match/:id/room')

room(

@Param('id') id:string,

@Body() body:any

){

return this.service.addRoom(

id,

body

);

}








@Post('match/:id/finish')

finish(

@Param('id') id:string

){

return this.service.finishMatch(id);

}



}
