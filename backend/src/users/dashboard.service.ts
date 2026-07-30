import {
Injectable
} from '@nestjs/common';



import {
PrismaService
} from '../prisma/prisma.service';





@Injectable()

export class DashboardService {



constructor(

private prisma:PrismaService

){}








async getProfile(

userId:string

){



return this.prisma.user.findUnique({

where:{

id:userId

},



select:{


id:true,


name:true,


email:true,


pubg_uid:true,


balance:true,


created_at:true



}



});



}









async getMyTournaments(

userId:string

){





const slots =

await this.prisma.teamSlot.findMany({

where:{


user_id:userId


},



include:{



team:{



include:{


tournament:true,


slots:{



include:{


user:true


}


}



}



}



}



});







return slots.map(slot=>({


teamId:slot.team.id,


teamName:slot.team.name,


teamNumber:slot.team.team_number,


tournamentId:slot.team.tournament.id,


tournamentName:slot.team.tournament.name,


status:slot.team.tournament.status,


players:

slot.team.slots.map(s=>({


name:s.user?.name ?? null,


pubg_uid:s.user?.pubg_uid ?? null


}))



}));




}









async getMyMatches(

userId:string

){





const slots =

await this.prisma.teamSlot.findMany({

where:{


user_id:userId


}

});







const teamIds =

slots.map(

s=>s.team_id

);









return this.prisma.matchTeam.findMany({

where:{


team_id:{


in:teamIds


}


},



include:{


match:{


include:{


round:true,


tournament:true


}



},



team:true



}



});





}








}
