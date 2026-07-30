import {
Injectable
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';



@Injectable()

export class DashboardService {



constructor(

private prisma:PrismaService

){}







async getDashboard(

userId:string

){



const user =

await this.prisma.user.findUnique({

where:{

id:userId

},



select:{


id:true,

name:true,

email:true,

pubg_uid:true,

balance:true


}



});







const teams =

await this.prisma.teamSlot.findMany({

where:{


user_id:userId


},



include:{



team:{


include:{


tournament:true


}



}



}



});







const tournaments =

teams.map(item=>({


teamId:item.team.id,


teamName:item.team.name,


teamNumber:item.team.team_number,


tournament:item.team.tournament.name,


tournamentId:item.team.tournament_id



}));









const matches =

await this.prisma.matchTeam.findMany({

where:{


team_id:{


in:teams.map(

t=>t.team_id

)


}


},



include:{


match:{


include:{


round:true


}



}


}



});









return {

user,


tournaments,


matches


};





}









}
