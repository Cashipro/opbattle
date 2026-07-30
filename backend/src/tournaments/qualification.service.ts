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









// GET QUALIFIED TEAMS

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



team:{



select:{


id:true,


team_number:true,


name:true


}



}



}



});








return results.map(item=>({



team_id:item.team.id,


team_number:item.team.team_number,


team_name:item.team.name,


kills:item.kills,


points:item.points



}));






}









// CREATE NEXT ROUND

async createNextRound(

tournamentId:string,

previousRoundId:string

){





const previousMatches =

await this.prisma.tournamentMatch.findMany({

where:{


round_id:previousRoundId


}

});







if(!previousMatches.length){

throw new BadRequestException(

"No matches found"

);

}







let qualified:any[]=[];








for(const match of previousMatches){





const teams = await this.getQualifiedTeams(

match.id,

10

);





qualified.push(...teams);





}








if(!qualified.length){

throw new BadRequestException(

"No qualified teams"

);

}









const lastRound =

await this.prisma.tournamentRound.findFirst({

where:{


tournament_id:tournamentId


},



orderBy:{


round_number:"desc"


}



});







const nextRoundNumber =

lastRound.round_number + 1;








const newRound =

await this.prisma.tournamentRound.create({

data:{



tournament_id:tournamentId,



round_number:nextRoundNumber,



name:`Round ${nextRoundNumber}`



}



});








let matchNumber = 1;

let index = 0;








while(index < qualified.length){





const match =

await this.prisma.tournamentMatch.create({

data:{



tournament_id:tournamentId,



round_id:newRound.id,



match_number:matchNumber,



status:"pending"



}



});








const teams = qualified.slice(

index,

index + 25

);








for(const team of teams){



await this.prisma.matchTeam.create({

data:{



match_id:match.id,



team_id:team.team_id



}



});



}








index += 25;


matchNumber++;






}








return {


message:"Next round created successfully",


round:newRound.name,


qualifiedTeams:qualified.length



};






}







}
