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









async getQualifiedTeams(

matchId:string,

limit:number

){





const results =

await this.prisma.matchResult.findMany({

where:{


match_id:matchId


},



include:{


team:true


},



orderBy:[


{

points:"desc"

},


{

kills:"desc"

}


],



take:limit



});







if(!results.length){


throw new BadRequestException(

"No results found"

);


}






return results;



}









async getRoundQualification(

roundId:string,

limit:number

){





const matches =

await this.prisma.tournamentMatch.findMany({

where:{


round_id:roundId


}



});







let qualified:any[]=[];







for(const match of matches){



const teams =

await this.getQualifiedTeams(

match.id,

limit

);






qualified.push(

...teams

);



}







return qualified;



}







}
