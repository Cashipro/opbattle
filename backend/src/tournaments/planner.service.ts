import {
Injectable
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';





@Injectable()

export class PlannerService {



constructor(

private prisma:PrismaService

){}








async createPlan(

tournamentId:string

){





const teams =

await this.prisma.tournamentTeam.findMany({

where:{


tournament_id:tournamentId,


slots:{


some:{


user_id:{
not:null
}


}

}


}


});






if(!teams.length){

return {

message:"No teams joined"

};

}






const totalTeams = teams.length;



const perMatch = 25;



const totalMatches = Math.ceil(

totalTeams / perMatch

);






for(

let i=1;

i<=totalMatches;

i++

){



const round =

await this.prisma.tournamentRound.create({

data:{


tournament_id:tournamentId,


round_number:i,


name:`Round ${i}`


}

});





}



return {

message:"Tournament Plan Created",

teams:totalTeams,

matches:totalMatches


};





}





}
