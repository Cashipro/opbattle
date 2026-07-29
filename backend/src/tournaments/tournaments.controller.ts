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





@Controller('tournaments')

export class TournamentsController {



constructor(

private tournamentsService:TournamentsService,

private joinService:JoinService

){}







@Get()

findAll(){

return this.tournamentsService.findAll();

}





@Get(':id')

findOne(

@Param('id') id:string

){

return this.tournamentsService.findOne(id);

}







@Post(':id/join')

join(

@Param('id') id:string,

@Body() body:any

){



return this.joinService.joinTournament(

body.userId,

id

);


}





}
