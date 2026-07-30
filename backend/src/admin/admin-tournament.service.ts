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








const tournament = await this.prisma.$transaction(async(tx)=>{



// CREATE TOURNAMENT

const createdTournament = await tx.tournament.create({

data:{


name:data.name,


entry_fee:Number(data.entry_fee),


currency:data.currency,


reward:data.reward ? Number(data.reward) : null,


start_date:new Date(data.start_date),


start_time:data.start_time,


status:"upcoming"



}


});








// CREATE 100 PUBG TEAMS

for(let teamNumber = 1; teamNumber <= 100; teamNumber++){



const team = await tx.tournamentTeam.create({

data:{


tournament_id:createdTournament.id,


team_number:teamNumber,


name:`Team ${teamNumber}`



}

});









// CREATE 4 EMPTY SLOTS

for(let slotNumber = 1; slotNumber <= 4; slotNumber++){



await tx.teamSlot.create({

data:{


team_id:team.id,


slot_number:slotNumber,


user_id:null,


joined_at:null



}

});



}



}








return createdTournament;



});








return {


message:"Tournament created with 100 teams",


tournament



};



}









async allTournaments(){



return this.prisma.tournament.findMany({

orderBy:{


created_at:'desc'


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


orderBy:{


slot_number:"asc"


},


include:{


user:{


select:{


id:true,


name:true,


pubg_uid:true


}


}


}



}



});



}









// ADD MORE TEAMS LATER

async addTeams(

tournamentId:string,

count:number

){



const lastTeam = await this.prisma.tournamentTeam.findFirst({

where:{


tournament_id:tournamentId


},


orderBy:{


team_number:"desc"


}



});






let start = lastTeam

?

lastTeam.team_number + 1

:

1;








for(

let i = start;

i < start + count;

i++

){



const team = await this.prisma.tournamentTeam.create({

data:{


tournament_id:tournamentId,


team_number:i,


name:`Team ${i}`



}

});








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


message:`${count} teams added successfully`


};



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
