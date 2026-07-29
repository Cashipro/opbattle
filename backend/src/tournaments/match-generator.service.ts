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

round_number:'asc'

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

team_number:'asc'

}


});







let index = 0;





for(const round of rounds){






const matchCount =

Math.ceil(

teams.length / 25

);






for(

let m=1;

m<=matchCount;

m++

){






const existing =

await this.prisma.tournamentMatch.findFirst({

where:{

round_id:round.id,

match_number:m

}

});







if(existing){

continue;

}






const match =

await this.prisma.tournamentMatch.create({

data:{


tournament_id:tournamentId,


round_id:round.id,


match_number:m


}

});







const matchTeams =

teams.slice(

index,

index + 25

);







for(const team of matchTeams){



await this.prisma.matchTeam.create({

data:{


match_id:match.id,


team_id:team.id


}


});



}






index +=25;






}



}




return {

message:"Matches Generated Successfully"

};



}





}
