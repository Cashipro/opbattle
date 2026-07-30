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

}

});







if(!previousRound){

throw new BadRequestException(

"Previous round not found"

);

}









const existingRound =

await this.prisma.tournamentRound.findFirst({

where:{


tournament_id:tournamentId,


round_number:{
gt:previousRound.round_number
}


}

});







if(existingRound){

throw new BadRequestException(

"Next round already generated"

);

}









const matches =

await this.prisma.tournamentMatch.findMany({

where:{


round_id:previousRoundId


}

});








if(!matches.length){

throw new BadRequestException(

"No previous matches found"

);

}








let qualifiedTeams:any[]=[];








for(const match of matches){





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


team:true


}



});








qualifiedTeams.push(...results);



}









if(!qualifiedTeams.length){

throw new BadRequestException(

"No qualified teams"

);

}









const nextRoundNumber =

previousRound.round_number + 1;







const round =

await this.prisma.tournamentRound.create({

data:{


tournament_id:tournamentId,


round_number:nextRoundNumber,


name:`Round ${nextRoundNumber}`



}

});









let index = 0;

let matchNumber = 1;

const teamsPerMatch = 25;







while(index < qualifiedTeams.length){





const match =

await this.prisma.tournamentMatch.create({

data:{


tournament_id:tournamentId,


round_id:round.id,


match_number:matchNumber,


status:"pending"



}

});








const teams =

qualifiedTeams.slice(

index,

index + teamsPerMatch

);








for(const item of teams){



await this.prisma.matchTeam.create({

data:{


match_id:match.id,


team_id:item.team_id



}

});



}








index += teamsPerMatch;


matchNumber++;






}








return {


message:"Next round generated successfully",


round:round.name,


qualifiedTeams:qualifiedTeams.length,


matchesCreated:matchNumber-1



};






}







}
