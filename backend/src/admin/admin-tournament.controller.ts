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









// CREATE TOURNAMENT

@Post()

createTournament(

@Body() body:any

){


return this.adminTournamentService.createTournament(

body

);


}









// ALL TOURNAMENTS

@Get()

allTournaments(){


return this.adminTournamentService.allTournaments();


}









// CLOSE JOINING

@Post(':id/close')

closeEntries(

@Param('id') id:string

){


return this.adminTournamentService.closeEntries(

id

);


}









// GET TEAMS

@Get(':id/teams')

teams(

@Param('id') id:string

){


return this.adminTournamentService.getTournamentTeams(

id

);


}









// INCREASE TEAMS

@Post(':id/increase-teams')

increaseTeams(

@Param('id') id:string,


@Body() body:any

){



return this.adminTournamentService.increaseTeams(

id,


Number(body.amount || 100)


);


}









// ADD MATCH ROOM

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









// FINISH MATCH

@Post('match/:id/finish')

finishMatch(

@Param('id') id:string

){


return this.adminTournamentService.finishMatch(

id

);


}









// CALCULATE NEXT ROUND

@Post(':id/calculate-plan')

calculatePlan(

@Param('id') id:string

){


return this.autoPlannerService.calculatePlan(

id

);


}









// NEXT ROUND

@Post(':id/next-round')

nextRound(

@Param('id') id:string

){


return this.nextRoundService.generateNextRound(

id

);


}



}
