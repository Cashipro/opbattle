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
PlannerService
} from './planner.service';


import {
MatchGeneratorService
} from './match-generator.service';


import {
MatchManagementService
} from './match-management.service';


import {
ResultService
} from './result.service';


import {
QualificationService
} from './qualification.service';


import {
ResultBoardService
} from './result-board.service';






@Controller('tournaments')

export class TournamentsController {



constructor(


private tournamentsService:TournamentsService,


private plannerService:PlannerService,


private matchGeneratorService:MatchGeneratorService,


private matchManagementService:MatchManagementService,


private resultService:ResultService,


private qualificationService:QualificationService,


private resultBoardService:ResultBoardService


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








@Get('match/:id/teams')

teams(

@Param('id') id:string

){

return this.resultService.getMatchTeams(id);

}








@Post('match/:id/result')

addResult(

@Param('id') id:string,

@Body() body:any

){

return this.resultService.addResult(

id,

body

);

}








@Post('match/:id/complete')

completeMatch(

@Param('id') id:string

){

return this.qualificationService.completeMatch(id);

}








@Post(':id/next-round')

nextRound(

@Param('id') id:string,

@Body() body:any

){

return this.qualificationService.createNextRound(

id,

body.roundId

);

}








@Get(':id/result-board')

resultBoard(

@Param('id') id:string

){

return this.resultBoardService.tournamentResults(id);

}








@Get(':id/final-ranking')

finalRanking(

@Param('id') id:string

){

return this.resultBoardService.finalRanking(id);

}





}
