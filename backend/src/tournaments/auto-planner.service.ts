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

"No teams found"

);

}








const existingRounds =

await this.prisma.tournamentRound.count({

where:{

tournament_id:tournamentId

}

});







if(existingRounds){

throw new BadRequestException(

"Plan already created"

);

}









const round =

await this.prisma.tournamentRound.create({

data:{


tournament_id:tournamentId,


round_number:1,


name:"Round 1"


}

});







const teamsPerMatch = 25;



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


message:"Tournament plan created",


teams:teams.length,


matches:matchNumber-1,


round:"Round 1"


};



}







}
