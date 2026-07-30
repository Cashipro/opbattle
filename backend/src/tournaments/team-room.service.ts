import {
Injectable,
BadRequestException
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';




@Injectable()

export class TeamRoomService {



constructor(

private prisma:PrismaService

){}







// PUBG ROOM VIEW

async getRoom(

tournamentId:string,

userId:string

){



const joined = await this.prisma.tournamentJoin.findUnique({

where:{

tournament_id_user_id:{

tournament_id:tournamentId,

user_id:userId

}

}

});







if(!joined){

throw new BadRequestException(

"You have not joined this tournament"

);

}








const teams = await this.prisma.tournamentTeam.findMany({

where:{

tournament_id:tournamentId

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


}



});







return teams;



}






}
