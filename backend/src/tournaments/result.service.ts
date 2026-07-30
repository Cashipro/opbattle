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









async addResult(

matchId:string,

body:any

){





const {

matchTeamId,

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







if(match.status !== "finished"){


throw new BadRequestException(

"Finish match before adding result"

);


}








const already =

await this.prisma.matchResult.findFirst({

where:{


match_id:matchId,


team_id:matchTeamId


}

});







if(already){


throw new BadRequestException(

"Result already added"

);


}








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









const positionPoints =

this.calculatePositionPoints(

Number(position)

);







const killPoints =

Number(kills);








const totalPoints =

positionPoints + killPoints;









const result =

await this.prisma.matchResult.create({

data:{



match_id:matchId,


team_id:matchTeam.team_id,


kills:Number(kills),


position:Number(position),


points:totalPoints



},



include:{



team:true



}



});








return {


message:"Result saved successfully",


result



};



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
