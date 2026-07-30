import {
  Injectable,
  BadRequestException
} from '@nestjs/common';


import {
  PrismaService
} from '../prisma/prisma.service';







@Injectable()
export class AdminTournamentService {



constructor(
  private prisma:PrismaService
){}









async createTournament(

data:any

){



if(
!data.name ||
!data.entry_fee ||
!data.currency ||
!data.start_date ||
!data.start_time
){

throw new BadRequestException(
"Missing tournament fields"
);

}









const tournament =

await this.prisma.tournament.create({

data:{


name:data.name,


entry_fee:Number(data.entry_fee),


currency:data.currency,


reward:data.reward
?
Number(data.reward)
:
null,


start_date:new Date(data.start_date),


start_time:data.start_time,


status:"upcoming"


}

});









// CREATE 100 PUBG TEAMS

for(
let teamNumber=1;
teamNumber<=100;
teamNumber++
){



const team =

await this.prisma.tournamentTeam.create({

data:{


tournament_id:tournament.id,


team_number:teamNumber,


name:`Team ${teamNumber}`


}

});








// 4 PLAYER SLOTS

for(
let slot=1;
slot<=4;
slot++
){



await this.prisma.teamSlot.create({

data:{


team_id:team.id,


slot_number:slot


}

});


}



}









return {


message:"Tournament created with 100 teams",


tournament


};



}









async allTournaments(){


return this.prisma.tournament.findMany({

orderBy:{


created_at:"desc"


},


include:{


teams:true


}


});


}









async closeEntries(

id:string

){



return this.prisma.tournament.update({

where:{

id

},

data:{


status:"closed"


}


});


}









async getTournamentTeams(

id:string

){



return this.prisma.tournamentTeam.findMany({

where:{


tournament_id:id


},


orderBy:{


team_number:"asc"


},


include:{


slots:{


include:{


user:true


}

}

}


});


}









async addRoom(

matchId:string,

data:any

){



return this.prisma.tournamentMatch.update({

where:{

id:matchId

},


data:{


room_id:data.room_id,


room_password:data.room_password,


status:"live"


}


});


}









async finishMatch(

matchId:string

){



return this.prisma.tournamentMatch.update({

where:{

id:matchId

},


data:{


status:"completed"


}


});


}



}
