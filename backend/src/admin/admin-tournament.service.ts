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



const tournament =

await this.prisma.tournament.create({

data:{


name:data.name,


entry_fee:Number(data.entry_fee),


currency:data.currency,


reward:Number(data.reward),


start_date:new Date(data.start_date),


start_time:data.start_time,


status:"upcoming"


}



});




return tournament;



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
