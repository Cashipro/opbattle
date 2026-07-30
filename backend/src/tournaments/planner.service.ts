import {
Injectable,
BadRequestException
} from '@nestjs/common';



import {
PrismaService
} from '../prisma/prisma.service';







@Injectable()

export class PlannerService {



constructor(

private prisma:PrismaService

){}









async createPlan(

tournamentId:string

){





const tournament =

await this.prisma.tournament.findUnique({

where:{

id:tournamentId

}

});







if(!tournament){

throw new BadRequestException(

"Tournament not found"

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

"No teams available. Generate teams first"

);

}









const existingRounds =

await this.prisma.tournamentRound.count({

where:{


tournament_id:tournamentId


}

});







if(existingRounds > 0){

throw new BadRequestException(

"Tournament plan already exists"

);

}









const teamsPerMatch = 25;


const totalMatches = Math.ceil(

teams.length / teamsPerMatch

);









const round =

await this.prisma.tournamentRound.create({

data:{


tournament_id:tournamentId,


round_number:1,


name:"Round 1"



}

});









let index = 0;


let matchNumber = 1;








while(index < teams.length){





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








return {


message:"Tournament plan created successfully",


round:"Round 1",


totalTeams:teams.length,


totalMatches



};






}







}
