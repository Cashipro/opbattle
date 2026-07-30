import {
Injectable
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





const teams =

await this.prisma.tournamentTeam.findMany({

where:{


tournament_id:tournamentId,


slots:{


some:{


user_id:{


not:null


}


}


}


},



orderBy:{


team_number:"asc"


}



});







if(!teams.length){


return {


message:"No active teams found"


};


}







const existing =

await this.prisma.tournamentRound.findFirst({

where:{


tournament_id:tournamentId


}

});







if(existing){


return {


message:"Plan already exists"


};


}








const teamsPerMatch = 25;



const totalMatches = Math.ceil(

teams.length / teamsPerMatch

);








let index = 0;







const round =

await this.prisma.tournamentRound.create({

data:{


tournament_id:tournamentId,


round_number:1,


name:"Round 1"


}

});







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


teams:teams.length,


matches:totalMatches


};





}






}
