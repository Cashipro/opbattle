import {
Injectable,
BadRequestException
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';





@Injectable()

export class MatchGeneratorService {



constructor(

private prisma:PrismaService

){}









async generateMatches(

tournamentId:string

){





const rounds =

await this.prisma.tournamentRound.findMany({

where:{

tournament_id:tournamentId

},


orderBy:{

round_number:"asc"

}

});







if(!rounds.length){

throw new BadRequestException(

"Create tournament plan first"

);

}







const teams =

await this.prisma.tournamentTeam.findMany({

where:{

tournament_id:tournamentId

},


orderBy:{

team_number:"asc"

}

});







if(!teams.length){

throw new BadRequestException(

"No teams found"

);

}







const teamsPerMatch = 25;







for(const round of rounds){



let index = 0;

let matchNumber = 1;







while(index < teams.length){





const exists =

await this.prisma.tournamentMatch.findFirst({

where:{


round_id:round.id,


match_number:matchNumber


}

});







if(exists){

index += teamsPerMatch;

matchNumber++;

continue;

}







const match =

await this.prisma.tournamentMatch.create({

data:{


tournament_id:tournamentId,


round_id:round.id,


match_number:matchNumber,


status:"pending"


}

});







const matchTeams = teams.slice(

index,

index + teamsPerMatch

);







for(const team of matchTeams){



await this.prisma.matchTeam.create({

data:{


match_id:match.id,


team_id:team.id


}

});



}







index += teamsPerMatch;


matchNumber++;





}



}







return {


message:"Matches generated successfully"


};



}






}
