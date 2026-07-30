import {
Injectable,
BadRequestException
} from '@nestjs/common';



import {
PrismaService
} from '../prisma/prisma.service';







@Injectable()

export class QualificationService {



constructor(

private prisma:PrismaService

){}









// COMPLETE MATCH

async completeMatch(

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


status:"completed"


}



});






}









// GET QUALIFIED TEAMS FROM MATCH

async getQualifiedTeams(

matchId:string,

limit:number

){





const results =

await this.prisma.matchResult.findMany({

where:{


match_id:matchId


},



orderBy:[


{

points:"desc"

},


{

kills:"desc"

}


],



take:limit,



include:{


team:true


}



});









return results.map(item=>({



team_id:item.team_id,


team_number:item.team.team_number,


team_name:item.team.name || 

`Team ${item.team.team_number}`,



kills:item.kills,


points:item.points



}));






}









// CREATE NEXT ROUND QUALIFICATION LIST

async createNextRound(

tournamentId:string,

previousRoundId:string

){





const matches =

await this.prisma.tournamentMatch.findMany({

where:{


round_id:previousRoundId


}

});







if(!matches.length){

throw new BadRequestException(

"No matches found"

);

}








let qualified:any[]=[];







for(const match of matches){





const teams =

await this.getQualifiedTeams(

match.id,

10

);







qualified.push(...teams);






}







if(!qualified.length){

throw new BadRequestException(

"No qualified teams found"

);

}








return {


message:"Teams qualified successfully",


totalQualified:qualified.length,


teams:qualified



};






}







}
