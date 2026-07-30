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









// ALL MATCHES OF TOURNAMENT

async getMatches(

tournamentId:string

){





return this.prisma.tournamentRound.findMany({

where:{


tournament_id:tournamentId


},



orderBy:{


round_number:"asc"


},



include:{



matches:{



orderBy:{


match_number:"asc"


},



include:{



teams:{



include:{



team:{



select:{


id:true,


team_number:true,


name:true,


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



}



}



});






}









// SINGLE MATCH

async getMatch(

matchId:string

){





const match =

await this.prisma.tournamentMatch.findUnique({

where:{


id:matchId


},



include:{



teams:{



include:{



team:{



select:{



id:true,


team_number:true,


name:true,


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



});







if(!match){

throw new BadRequestException(

"Match not found"

);

}







return match;






}









// ADD ROOM DETAILS

async updateRoom(

matchId:string,

room_id:string,

room_password:string

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


status:"ready"


}



});






}









// START MATCH

async startMatch(

matchId:string

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


status:"started"


}



});






}









// FINISH MATCH

async finishMatch(

matchId:string

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


status:"finished"


}



});






}







}
