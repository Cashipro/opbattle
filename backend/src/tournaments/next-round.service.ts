import {
Injectable,
BadRequestException
} from '@nestjs/common';



import {
PrismaService
} from '../prisma/prisma.service';







@Injectable()

export class NextRoundService {



constructor(

private prisma:PrismaService

){}









async generateNextRound(

tournamentId:string,

previousRoundId:string

){





const previousRound =

await this.prisma.tournamentRound.findUnique({

where:{


id:previousRoundId


},



include:{



matches:true



}



});







if(!previousRound){

throw new BadRequestException(

"Previous round not found"

);

}









const existingNext =

await this.prisma.tournamentRound.findFirst({

where:{


tournament_id:tournamentId,


round_number:{

gt:previousRound.round_number

}



}

});







if(existingNext){

throw new BadRequestException(

"Next round already created"

);

}









let qualifiedTeams:any[]=[];









for(const match of previousRound.matches){





const results =

await this.prisma.matchResult.findMany({

where:{


match_id:match.id


},



orderBy:[


{


points:"desc"

},


{


kills:"desc"

}



],



take:10,



include:{



team:{



select:{


id:true,


team_number:true,


name:true


}



}



}



});








qualifiedTeams.push(

...results.map(item=>({



team_id:item.team.id,


team_number:item.team.team_number,


team_name:item.team.name,


points:item.points,


kills:item.kills



}))



);






}









if(!qualifiedTeams.length){

throw new BadRequestException(

"No qualified teams found"

);

}









const newRoundNumber =

previousRound.round_number + 1;









const newRound =

await this.prisma.tournamentRound.create({

data:{



tournament_id:tournamentId,



round_number:newRoundNumber,



name:`Round ${newRoundNumber}`



}

});









let index = 0;

let matchNumber = 1;









while(index < qualifiedTeams.length){





const match =

await this.prisma.tournamentMatch.create({

data:{



tournament_id:tournamentId,



round_id:newRound.id,



match_number:matchNumber,



status:"pending"



}

});









const teams = qualifiedTeams.slice(

index,

index + 25

);









for(const team of teams){



await this.prisma.matchTeam.create({

data:{



match_id:match.id,



team_id:team.team_id



}



});



}








index += 25;


matchNumber++;






}









return {


message:"Next round generated successfully",


round:newRound.name,


qualifiedTeams:qualifiedTeams.length,


matches:matchNumber - 1



};






}







}
