import {
Injectable,
BadRequestException
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';





@Injectable()

export class QualificationService {



constructor(

private prisma:PrismaService

){}








async completeMatch(

matchId:string

){



const match =

await this.prisma.tournamentMatch.findUnique({

where:{

id:matchId

}

});







if(!match){

throw new BadRequestException(

"Match not found"

);

}







return this.prisma.tournamentMatch.update({

where:{

id:matchId

},



data:{


status:"completed"


}



});



}









async getQualifiedTeams(

matchId:string,

limit:number

){



const results =

await this.prisma.matchResult.findMany({

where:{


match_id:matchId


},



orderBy:{


points:"desc"


},



take:limit,



include:{


team:true


}



});







return results;



}









async createNextRound(

tournamentId:string,

previousRoundId:string,

qualifiedLimit:number

){





const previousMatches =

await this.prisma.tournamentMatch.findMany({

where:{


round_id:previousRoundId


}

});








let qualified:any[] = [];







for(const match of previousMatches){



const teams =

await this.getQualifiedTeams(

match.id,

qualifiedLimit

);



qualified.push(...teams);



}







if(!qualified.length){

throw new BadRequestException(

"No qualified teams found"

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







if(!lastRound){

throw new BadRequestException(

"Round not found"

);

}








const nextRoundNumber =

lastRound.round_number + 1;








const newRound =

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







while(index < qualified.length){





const match =

await this.prisma.tournamentMatch.create({

data:{


tournament_id:tournamentId,


round_id:newRound.id,


match_number:matchNumber,


status:"pending"


}

});







const teams = qualified.slice(

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


message:"Next round created successfully",


round:newRound.name,


qualifiedTeams:qualified.length



};



}






}
