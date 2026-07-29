import {
Injectable
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';





@Injectable()

export class ResultBoardService {



constructor(

private prisma:PrismaService

){}








async tournamentResults(

tournamentId:string

){



const rounds =

await this.prisma.tournamentRound.findMany({

where:{

tournament_id:tournamentId

},


orderBy:{

round_number:'asc'

},



include:{


matches:{



include:{


results:{


include:{


team:true


},



orderBy:{


points:'desc'


}



}



}



}



}


});





return rounds;



}









async finalRanking(

tournamentId:string

){



const results =

await this.prisma.matchResult.findMany({

where:{


match:{


tournament_id:tournamentId


}


},



include:{


team:true


}



});







const ranking:any={};







for(const item of results){



if(!ranking[item.team_id]){


ranking[item.team_id]={


team_id:item.team_id,


team:item.team,


kills:0,


points:0


};



}





ranking[item.team_id].kills += item.kills;


ranking[item.team_id].points += item.points;



}








return Object.values(ranking)

.sort(

(a:any,b:any)=>


b.points-a.points

);



}







}
