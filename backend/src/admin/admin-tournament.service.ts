import {
Injectable,
BadRequestException
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';

import {
TeamRoomService
} from '../tournaments/team-room.service';







@Injectable()

export class AdminTournamentService {



constructor(

private prisma:PrismaService,


private teamRoomService:TeamRoomService

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








return this.prisma.$transaction(async(tx)=>{



const tournament = await tx.tournament.create({

data:{


name:data.name,


entry_fee:Number(data.entry_fee),


currency:data.currency,


reward:data.reward

?

Number(data.reward)

:

0,



start_date:new Date(
data.start_date
),



start_time:data.start_time,



status:"upcoming",



max_teams:data.max_teams

?

Number(data.max_teams)

:

100,



players_per_team:4


}



});








const teams = tournament.max_teams;



for(

let i=1;

i<=teams;

i++

){



const team = await tx.tournamentTeam.create({

data:{


tournament_id:tournament.id,


team_number:i,


name:`Team ${i}`


}

});







for(

let s=1;

s<=4;

s++

){



await tx.teamSlot.create({

data:{


team_id:team.id,


slot_number:s,


user_id:null


}

});


}



}








return tournament;



});



}









async allTournaments(){



return this.prisma.tournament.findMany({

orderBy:{


created_at:"desc"


},



include:{


teams:{


include:{


slots:true


}


}



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









async increaseTeams(

id:string,

amount:number

){



return this.teamRoomService.increaseTeams(

id,

amount

);



}









async addRoom(

matchId:string,

data:any

){



if(

!data.room_id

){


throw new BadRequestException(

"Room ID required"

);


}







return this.prisma.tournamentMatch.update({

where:{


id:matchId


},



data:{


room_id:data.room_id,


room_password:data.room_password || null,


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
