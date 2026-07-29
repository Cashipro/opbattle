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


}


});



}








async findOne(id:string){



return this.prisma.tournament.findUnique({

where:{


id


},


include:{


slots:true


}


});


}





}
