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





const matches =

await this.prisma.tournamentMatch.findMany({

where:{

round_id:previousRoundId

}



});






let qualifiedTeams:any[]=[];






for(const match of matches){



const results =

await this.prisma.matchResult.findMany({

where:{


match_id:match.id


},



orderBy:{


points:'desc'


}



});





const topTeams =

results.slice(

0,

10

);





qualifiedTeams.push(

...topTeams

);



}







if(!qualifiedTeams.length){


throw new BadRequestException(

"No qualified teams"

);

}









const lastRound =

await this.prisma.tournamentRound.findFirst({

where:{


tournament_id:tournamentId


},


orderBy:{


round_number:'desc'


}



});







const newRoundNumber =

lastRound.round_number + 1;






const newRound =

await this.prisma.tournamentRound.create({

data:{


tournament_id:tournamentId,


round_number:newRoundNumber,


name:

`Round ${newRoundNumber}`



}


});







let matchNumber=1;

let index=0;






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







const teams =

qualifiedTeams.slice(

index,

index+25

);








for(const item of teams){



await this.prisma.matchTeam.create({

data:{


match_id:match.id,


team_id:item.team_id



}



});


}







index +=25;


matchNumber++;





}







return {


message:"Next Round Generated",


round:newRound.name,


qualified:

qualifiedTeams.length



};



}





}
