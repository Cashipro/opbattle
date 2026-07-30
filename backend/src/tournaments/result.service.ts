import {
Injectable,
BadRequestException
} from '@nestjs/common';



import {
PrismaService
} from '../prisma/prisma.service';







@Injectable()

export class ResultService {



constructor(

private prisma:PrismaService

){}









// GET MATCH TEAMS FOR ADMIN RESULT ENTRY

async getMatchTeams(

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



});







if(!match){

throw new BadRequestException(

"Match not found"

);

}







return match;






}









// ADD MATCH RESULT

async addResult(

matchId:string,

body:any

){





const {

teamId,

kills,

position

}=body;








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








const team =

await this.prisma.tournamentTeam.findUnique({

where:{

id:teamId

}

});







if(!team){

throw new BadRequestException(

"Team not found"

);

}








const already =

await this.prisma.matchResult.findUnique({

where:{


match_id_team_id:{


match_id:matchId,


team_id:teamId


}



}

});







if(already){

throw new BadRequestException(

"Result already added for this team"

);

}








const killPoints =

Number(kills) || 0;





const positionPoints =

this.calculatePositionPoints(

Number(position)

);








const totalPoints =

killPoints + positionPoints;









const result =

await this.prisma.matchResult.create({

data:{



match_id:matchId,



team_id:teamId,



kills:killPoints,



position:Number(position),



points:totalPoints



}



});







return {


message:"Result added successfully",


team_number:team.team_number,


team_name:team.name,


kills:killPoints,


position:Number(position),


points:totalPoints,


result



};






}









calculatePositionPoints(

position:number

){



const table:any={


1:15,


2:12,


3:10,


4:8,


5:6,


6:5,


7:4,


8:3,


9:2,


10:1


};






return table[position] || 0;



}







}
