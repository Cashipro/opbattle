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

tournamentId:string,

roundId:string

){





const round =

await this.prisma.tournamentRound.findUnique({

where:{

id:roundId

}

});







if(!round){

throw new BadRequestException(

"Round not found"

);

}








const alreadyCreated =

await this.prisma.tournamentMatch.count({

where:{


round_id:roundId


}

});







if(alreadyCreated > 0){

throw new BadRequestException(

"Matches already generated"

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



let index = 0;

let matchNumber = 1;







while(index < teams.length){





const match =

await this.prisma.tournamentMatch.create({

data:{


tournament_id:tournamentId,


round_id:roundId,


match_number:matchNumber,


status:"pending"



}

});









const matchTeams =

teams.slice(

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









return {


message:"Matches generated successfully",


round:round.name,


totalMatches:matchNumber - 1,


totalTeams:teams.length



};






}







}
