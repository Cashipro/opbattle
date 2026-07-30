import {
Injectable,
BadRequestException
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







if(!rounds.length){

throw new BadRequestException(

"No results found"

);

}







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



team:{



select:{



id:true,


team_number:true,


name:true



}



}



}

});







const ranking:any = {};







for(const item of results){



if(!ranking[item.team_id]){



ranking[item.team_id]={



team_id:item.team_id,


team_number:item.team.team_number,


team_name:item.team.name,



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

b.points - a.points

)

.map(

(item:any,index)=>({



rank:index+1,


...item



})

);



}








async teamRanking(

tournamentId:string

){



const ranking =

await this.finalRanking(tournamentId);







return ranking.map((team:any)=>({



rank:team.rank,


team:

`#${team.team_number} ${team.team_name}`,



kills:team.kills,


points:team.points



}));



}






}
