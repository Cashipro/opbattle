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


matches:true,


joins:{



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



});









if(!tournament){



throw new BadRequestException(

"Tournament not found"

);

}









return {


id:tournament.id,


name:tournament.name,


entry_fee:tournament.entry_fee,


currency:tournament.currency,


reward:tournament.reward,


start_date:tournament.start_date,


start_time:tournament.start_time,


status:tournament.status,



teams:tournament.teams,



totalTeams:tournament.teams.length,



players:tournament.joins.length



};



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








const tournament =

await this.prisma.tournament.create({

data:{


name:data.name,


entry_fee:Number(data.entry_fee),


currency:data.currency,


reward:data.reward
?
Number(data.reward)
:
null,


start_date:new Date(data.start_date),


start_time:data.start_time,


status:"upcoming"


}


});







return tournament;


}







}
