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





const existing =

await this.prisma.tournamentRound.findFirst({

where:{


tournament_id:tournamentId


}

});







if(existing){

throw new BadRequestException(

"Tournament plan already exists"

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

"No teams joined"

);

}









const maxTeamsPerMatch = 25;






let index = 0;

let matchNumber = 1;






const round =

await this.prisma.tournamentRound.create({

data:{


tournament_id:tournamentId,


round_number:1,


name:"Round 1"



}

});









while(index < teams.length){





const matchTeams =

teams.slice(

index,

index + maxTeamsPerMatch

);








const match =

await this.prisma.tournamentMatch.create({

data:{


tournament_id:tournamentId,


round_id:round.id,


match_number:matchNumber,


status:"pending"



}

});








for(const team of matchTeams){



await this.prisma.matchTeam.create({

data:{


match_id:match.id,


team_id:team.id



}

});



}








index += maxTeamsPerMatch;


matchNumber++;



}








return {


message:"Tournament plan created successfully",


totalTeams:teams.length,


round:"Round 1",


matchesCreated:matchNumber-1



};






}







}
