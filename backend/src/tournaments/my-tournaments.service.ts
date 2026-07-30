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



include:{



tournament:{



include:{



teams:{



orderBy:{


team_number:"asc"


},



include:{



slots:{



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



}



}



},



orderBy:{


joined_at:"desc"


}



});






}







}
