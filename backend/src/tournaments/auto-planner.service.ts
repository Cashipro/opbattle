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









let teams =

await this.prisma.tournamentTeam.findMany({

where:{


tournament_id:tournamentId


},



orderBy:{


team_number:"asc"


}

});








// AUTO GENERATE TEAMS IF NOT EXIST

if(!teams.length){





for(

let i=1;

i<=tournament.total_teams;

i++

){





const team =

await this.prisma.tournamentTeam.create({

data:{


tournament_id:tournamentId,


team_number:i,


name:`Team ${i}`


}

});








for(

let s=1;

s<=4;

s++

){



await this.prisma.teamSlot.create({

data:{


team_id:team.id,


slot_number:s


}

});



}



}







teams = await this.prisma.tournamentTeam.findMany({

where:{

tournament_id:tournamentId

},


orderBy:{

team_number:"asc"

}

});



}









const existingRound =

await this.prisma.tournamentRound.findFirst({

where:{


tournament_id:tournamentId,


round_number:1


}

});








let round = existingRound;







if(!round){



round = await this.prisma.tournamentRound.create({

data:{


tournament_id:tournamentId,


round_number:1,


name:"Round 1"


}

});



}









const existingMatches =

await this.prisma.tournamentMatch.count({

where:{


round_id:round.id


}

});







if(existingMatches > 0){



return {


message:"Tournament plan already created",


teams:teams.length,


matches:existingMatches



};



}









const perMatch = 25;



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

index + perMatch

);








for(const team of matchTeams){



await this.prisma.matchTeam.create({

data:{


match_id:match.id,


team_id:team.id



}

});



}








index += perMatch;


matchNumber++;






}









return {


message:"Tournament plan created successfully",


round:round.name,


totalTeams:teams.length,


totalMatches:matchNumber - 1



};






}







}
