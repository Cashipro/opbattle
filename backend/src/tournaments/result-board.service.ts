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


]



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


team_number:item.team.team_number,


team_name:item.team.name,


kills:0,


points:0,


matches:0



};



}








ranking[item.team_id].kills +=

item.kills || 0;



ranking[item.team_id].points +=

item.points || 0;



ranking[item.team_id].matches +=1;



}









const final =

Object.values(ranking)

.sort((a:any,b:any)=>{



if(b.points !== a.points){


return b.points-a.points;


}



return b.kills-a.kills;



});








return final.map((team:any,index)=>({


position:index+1,


team_id:team.team_id,


team_number:team.team_number,


team_name:team.team_name,


matches:team.matches,


kills:team.kills,


points:team.points



}));






}







}
