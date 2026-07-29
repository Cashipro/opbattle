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



return this.prisma.tournamentSlot.findMany({

where:{


user_id:userId


},



include:{



tournament:true,



team:true



},



orderBy:{


created_at:'desc'


}



});



}



}
