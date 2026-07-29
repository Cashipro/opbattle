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


team:true


}


}


}


});





if(!match){

throw new BadRequestException(

"Match not found"

);

}




return match.teams;



}









async addResult(

matchId:string,

data:any

){





const matchTeam =

await this.prisma.matchTeam.findUnique({

where:{

id:data.matchTeamId

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







const positionPoints = this.positionPoints(

data.position

);




const killPoints =

Number(data.kills);




const totalPoints =

positionPoints + killPoints;







return this.prisma.matchResult.create({

data:{


match_id:matchId,


team_id:matchTeam.team_id,


kills:Number(data.kills),


position:Number(data.position),


points:totalPoints


}



});





}









positionPoints(position:number){



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
