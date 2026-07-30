import {
Injectable
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



return this.prisma.tournament.findUnique({

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



}



}



});



}






}
