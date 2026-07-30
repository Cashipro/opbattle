import {
Injectable,
BadRequestException
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';







@Injectable()

export class TournamentsService {



constructor(

private prisma:PrismaService

){}









async findAll(){



return this.prisma.tournament.findMany({

where:{


status:{

not:"completed"

}


},



orderBy:{


created_at:"desc"


},



select:{


id:true,


name:true,


entry_fee:true,


currency:true,


reward:true,


start_date:true,


start_time:true,


status:true,


max_teams:true,


players_per_team:true,


created_at:true



}



});



}









async findOne(

id:string

){



const tournament =

await this.prisma.tournament.findUnique({

where:{


id

},



include:{


teams:{


orderBy:{


team_number:"asc"


},



include:{


slots:{


orderBy:{


slot_number:"asc"


},



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



},



rounds:true,


matches:true



}



});







if(!tournament){


throw new BadRequestException(

"Tournament not found"

);

}







return tournament;



}









async create(data:any){



if(

!data.name ||

!data.entry_fee ||

!data.currency ||

!data.start_date ||

!data.start_time

){


throw new BadRequestException(

"Missing tournament fields"

);


}







return this.prisma.$transaction(async(tx)=>{





const tournament = await tx.tournament.create({

data:{



name:data.name,


entry_fee:Number(data.entry_fee),


currency:data.currency,


reward:data.reward

?

Number(data.reward)

:

null,



start_date:new Date(
data.start_date
),



start_time:data.start_time,



status:"upcoming",



max_teams:data.max_teams

?

Number(data.max_teams)

:

100,



players_per_team:4



}


});









const totalTeams = tournament.max_teams;


const members = tournament.players_per_team;







for(

let team=1;

team<=totalTeams;

team++

){



const createdTeam = await tx.tournamentTeam.create({

data:{


tournament_id:tournament.id,


team_number:team,


name:`Team ${team}`


}

});








for(

let slot=1;

slot<=members;

slot++

){



await tx.teamSlot.create({

data:{


team_id:createdTeam.id,


slot_number:slot,


user_id:null,


joined_at:null


}

});


}



}








return tournament;



});



}







}
