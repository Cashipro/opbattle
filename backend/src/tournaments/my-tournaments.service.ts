import {
Injectable
} from '@nestjs/common';



import {
PrismaService
} from '../prisma/prisma.service';






@Injectable()

export class MyTournamentsService {



constructor(

private prisma:PrismaService

){}








async getMyTournaments(

userId:string

){





const slots =

await this.prisma.tournamentSlot.findMany({

where:{


user_id:userId


},



include:{



tournament:true,



team:{



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



}



}



},




orderBy:{


created_at:"desc"


}



});








return slots.map(item=>({



tournament:{


id:item.tournament.id,


name:item.tournament.name,


entry_fee:item.tournament.entry_fee,


reward:item.tournament.reward,


start_date:item.tournament.start_date,


start_time:item.tournament.start_time,


status:item.tournament.status


},





team:{


id:item.team.id,


name:item.team.name,


team_number:item.team.team_number,



players:item.team.slots.map(slot=>({


slot_number:slot.slot_number,


user:slot.user


}))



}



}));






}







}
