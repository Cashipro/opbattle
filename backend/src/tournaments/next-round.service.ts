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


},



include:{


results:true


}



});







if(!matches.length){


throw new BadRequestException(

"No matches found"

);


}









let qualifiedTeams:any[]=[];







for(const match of matches){



const results = match.results.sort(

(a,b)=>{


const totalA =

(a.points || 0) +

(a.kills || 0);



const totalB =

(b.points || 0) +

(b.kills || 0);



return totalB-totalA;



}

);







// top 50% teams qualify

const qualifyCount =

Math.ceil(results.length / 2);








const winners =

results.slice(

0,

qualifyCount

);






qualifiedTeams.push(

...winners

);



}









// remove duplicate teams

qualifiedTeams =

Array.from(

new Map(

qualifiedTeams.map(

team=>[

team.team_id,

team

]

)

).values()

);









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


round_number:"desc"


}



});








const nextRoundNumber =

(lastRound?.round_number || 0)+1;








const newRound =

await this.prisma.tournamentRound.create({

data:{


tournament_id:tournamentId,


round_number:nextRoundNumber,


name:

`Round ${nextRoundNumber}`



}



});









let matchNumber=1;

let index=0;









while(index < qualifiedTeams.length){





const matchTeams =

qualifiedTeams.slice(

index,

index+25

);







const newMatch =

await this.prisma.tournamentMatch.create({

data:{


tournament_id:tournamentId,


round_id:newRound.id,


match_number:matchNumber,


status:"pending"



}



});







for(const team of matchTeams){



await this.prisma.matchTeam.create({

data:{


match_id:newMatch.id,


team_id:team.team_id



}



});



}








index +=25;


matchNumber++;





}








return {

message:

"Next round generated successfully",


round:

newRound.name,


qualifiedTeams:

qualifiedTeams.length,


matchesCreated:

matchNumber-1



};






}






}
