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


status:"upcoming",



// default PUBG room

max_teams:100,


players_per_team:4



}

});








// AUTO CREATE 100 TEAMS

await this.teamRoomService.createTeams(

tournament.id

);








return {


message:"Tournament created with PUBG room",


tournament



};



}









async allTournaments(){



return this.prisma.tournament.findMany({

orderBy:{


created_at:"desc"


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


amount || 100

);


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
