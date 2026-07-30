import {
Injectable,
BadRequestException
} from '@nestjs/common';



import {
PrismaService
} from '../prisma/prisma.service';







@Injectable()

export class AutoPlannerService {



constructor(

private prisma:PrismaService

){}









async calculatePlan(

tournamentId:string

){





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








// check old plan

const oldRound =

await this.prisma.tournamentRound.findFirst({

where:{


tournament_id:tournamentId


}



});







if(oldRound){


throw new BadRequestException(

"Plan already generated"

);

}








const totalTeams = teams.length;






// maximum teams in one match

const maxTeamsPerMatch = 25;







const matchesNeeded =

Math.ceil(

totalTeams / maxTeamsPerMatch

);









// Create Round 1

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









while(index < totalTeams){





const remaining =

totalTeams - index;







const currentMatchSize =

Math.min(

remaining,

maxTeamsPerMatch

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









const matchTeams =

teams.slice(

index,

index + currentMatchSize

);








for(const team of matchTeams){



await this.prisma.matchTeam.create({

data:{


match_id:match.id,


team_id:team.id



}



});



}








index += currentMatchSize;


matchNumber++;



}









return {


message:"Tournament plan created successfully",


totalTeams,


roundsCreated:1,


matchesCreated:matchesNeeded,


matches:

`${matchesNeeded} matches created for Round 1`



};






}







}
