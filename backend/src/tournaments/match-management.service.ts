import {
Injectable,
BadRequestException
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';




@Injectable()

export class MatchManagementService {



constructor(

private prisma:PrismaService

){}







async getMatches(

tournamentId:string

){



return this.prisma.tournamentRound.findMany({

where:{


tournament_id:tournamentId


},


include:{


matches:{



include:{



teams:{



include:{



team:true



}


}



}



},


orderBy:{


match_number:'asc'


}



}



},



orderBy:{


round_number:'asc'


}



});



}










async updateRoom(


matchId:string,


room_id:string,


room_password:string,


status:string


){





const match =

await this.prisma.tournamentMatch.findUnique({

where:{

id:matchId

}

});





if(!match){


throw new BadRequestException(

"Match not found"

);


}







return this.prisma.tournamentMatch.update({

where:{


id:matchId


},


data:{


room_id,


room_password,


status


}



});




}



}
