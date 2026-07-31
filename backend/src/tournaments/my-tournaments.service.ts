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


tournament:true


}


});


}


}
