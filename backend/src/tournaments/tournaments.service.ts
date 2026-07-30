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







return this.prisma.tournament.create({

data:{



name:data.name,



entry_fee:Number(data.entry_fee),



currency:data.currency,



reward:data.reward ? Number(data.reward) : null,



start_date:new Date(data.start_date),



start_time:data.start_time



}



});



}







}
