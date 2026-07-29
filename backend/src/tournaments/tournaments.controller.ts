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





@Controller('tournaments')

export class TournamentsController {



constructor(


private tournamentsService:TournamentsService,


private plannerService:PlannerService,


private matchGeneratorService:MatchGeneratorService,


private matchManagementService:MatchManagementService,


private resultService:ResultService


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

matchTeams(

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




}
