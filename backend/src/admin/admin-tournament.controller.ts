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



import {
NextRoundService
} from '../tournaments/next-round.service';







@Controller('admin/tournaments')

export class AdminTournamentController {



constructor(


private adminTournamentService:AdminTournamentService,


private autoPlannerService:AutoPlannerService,


private nextRoundService:NextRoundService


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

allTournaments(){

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

teams(

@Param('id') id:string

){

return this.adminTournamentService.getTournamentTeams(

id

);

}









@Post('match/:id/room')

room(

@Param('id') id:string,

@Body() body:any

){

return this.adminTournamentService.addRoom(

id,

body

);

}









@Post('match/:id/finish')

finish(

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









@Post(':id/next-round')

nextRound(

@Param('id') id:string,

@Body() body:any

){

return this.nextRoundService.generateNextRound(

id,

body.roundId

);

}




}
