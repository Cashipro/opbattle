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









// ALL TOURNAMENTS

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



include:{



_count:{



select:{


teams:true,


matches:true


}



}



}



});



}









// SINGLE TOURNAMENT DETAILS

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



rounds:{



orderBy:{


round_number:"asc"


}



},



matches:{



orderBy:{


match_number:"asc"


}



},



_count:{



select:{


teams:true,


joins:true


}



}



}






});







if(!tournament){


throw new BadRequestException(

"Tournament not found"

);

}






return tournament;






}









// CREATE TOURNAMENT (ADMIN)

async create(data:any){



return this.prisma.tournament.create({

data:{



name:data.name,



entry_fee:Number(data.entry_fee),



reward:Number(data.reward),



total_teams:Number(data.total_teams || 25),



start_date:new Date(data.start_date),



start_time:data.start_time



}



});






}









// UPDATE STATUS

async updateStatus(

id:string,

status:string

){



const tournament =

await this.prisma.tournament.findUnique({

where:{


id


}

});







if(!tournament){


throw new BadRequestException(

"Tournament not found"

);

}







return this.prisma.tournament.update({

where:{


id


},



data:{


status


}



});






}







}
