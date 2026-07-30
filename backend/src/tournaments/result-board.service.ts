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









// ALL ROUND RESULTS

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



teams:{



include:{



team:true



}



},



results:{



orderBy:[


{

points:"desc"

},


{

kills:"desc"

}


],



include:{



team:true



}



}



}



}



}



});






}









// FINAL TOURNAMENT RANKING

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









const ranking:any = {};









for(const result of results){





const teamId = result.team_id;






if(!ranking[teamId]){



ranking[teamId]={



team_id:teamId,


team_number:result.team.team_number,


team_name:result.team.name || 

`Team ${result.team.team_number}`,



kills:0,


points:0,


matches:0



};



}








ranking[teamId].kills += result.kills || 0;



ranking[teamId].points += result.points || 0;



ranking[teamId].matches += 1;



}









const board =

Object.values(ranking)

.sort((a:any,b:any)=>{



if(b.points !== a.points){


return b.points - a.points;


}



return b.kills - a.kills;



});









return board.map((team:any,index)=>({



rank:index + 1,


team_number:team.team_number,


team_name:team.team_name,


matches:team.matches,


kills:team.kills,


points:team.points



}));






}







}
