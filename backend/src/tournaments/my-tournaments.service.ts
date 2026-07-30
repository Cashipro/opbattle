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



return this.prisma.tournamentJoin.findMany({

where:{


user_id:userId


},



orderBy:{


joined_at:"desc"


},



include:{



tournament:{


select:{


id:true,


name:true,


entry_fee:true,


currency:true,


reward:true,


start_date:true,


start_time:true,


status:true,


max_teams:true,


players_per_team:true



},



include:{



teams:{


where:{



slots:{



some:{


user_id:userId


}


}



},



select:{


id:true,


team_number:true,


name:true



}


}



}



}



},



});



}







}
