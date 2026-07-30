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









// ROUND WISE RESULTS

async tournamentResults(

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



results:{



orderBy:{


points:"desc"


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



}



}



}



}



});






}









// FINAL PUBG RANKING

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



team_number:item.team.team_number,



team_name:item.team.name,



kills:0,



points:0,



matches:0



};



}








ranking[item.team_id].kills += item.kills;



ranking[item.team_id].points += item.points;



ranking[item.team_id].matches += 1;






}









return Object.values(ranking)

.sort(

(a:any,b:any)=>



b.points - a.points || b.kills - a.kills



)

.map(

(team:any,index)=>({



rank:index + 1,


...team



})

);







}







}
