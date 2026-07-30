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









// GET MATCH TEAMS

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



}



});







if(!match){


throw new BadRequestException(

"Match not found"

);

}






return match;






}









// ADD RESULT

async addResult(

matchId:string,

body:any

){





const {

matchTeamId,

kills,

position

}=body;








const matchTeam =

await this.prisma.matchTeam.findUnique({

where:{


id:matchTeamId


},



include:{


team:true


}



});







if(!matchTeam){


throw new BadRequestException(

"Team not found"

);

}









const oldResult =

await this.prisma.matchResult.findUnique({

where:{



match_id_team_id:{



match_id:matchId,


team_id:matchTeam.team_id



}



}

});







if(oldResult){

throw new BadRequestException(

"Result already added for this team"

);

}








const positionPoints =

this.calculatePositionPoints(

Number(position)

);







const killPoints =

Number(kills);







const totalPoints =

positionPoints + killPoints;








return this.prisma.matchResult.create({

data:{



match_id:matchId,



team_id:matchTeam.team_id,



kills:Number(kills),



position:Number(position),



points:totalPoints



},



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






}









calculatePositionPoints(

position:number

){



const points:any={



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







return points[position] || 0;






}







}
