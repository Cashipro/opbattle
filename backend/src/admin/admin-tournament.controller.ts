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


import {
AutoPlannerService
} from '../tournaments/auto-planner.service';





@Controller('admin/tournaments')

export class AdminTournamentController {



constructor(


private adminTournamentService:AdminTournamentService,


private autoPlannerService:AutoPlannerService


){}








@Post()

createTournament(

@Body() body:any

){

return this.adminTournamentService.createTournament(

body

);

}









@Get()

getAllTournaments(){

return this.adminTournamentService.allTournaments();

}









@Post(':id/close')

closeEntries(

@Param('id') id:string

){

return this.adminTournamentService.closeEntries(

id

);

}









@Get(':id/teams')

getTeams(

@Param('id') id:string

){

return this.adminTournamentService.getTournamentTeams(

id

);

}









@Post('match/:id/room')

addRoom(

@Param('id') id:string,

@Body() body:any

){

return this.adminTournamentService.addRoom(

id,

body

);

}









@Post('match/:id/finish')

finishMatch(

@Param('id') id:string

){

return this.adminTournamentService.finishMatch(

id

);

}









@Post(':id/calculate-plan')

calculatePlan(

@Param('id') id:string

){

return this.autoPlannerService.calculatePlan(

id

);

}






}
