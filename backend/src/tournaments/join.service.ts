import {
Injectable,
BadRequestException
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';





@Injectable()

export class JoinService {



constructor(

private prisma:PrismaService

){}






async joinTournament(

userId:string,

tournamentId:string

){





const tournament =

await this.prisma.tournament.findUnique({

where:{

id:tournamentId

}

});





if(!tournament){

throw new BadRequestException(
"Tournament not found"
);

}







const already =

await this.prisma.tournamentSlot.findFirst({

where:{


tournament_id:tournamentId,


user_id:userId


}


});





if(already){

throw new BadRequestException(

"You already joined this tournament"

);

}







const user =

await this.prisma.user.findUnique({

where:{

id:userId

}

});





if(!user){

throw new BadRequestException(

"User not found"

);

}








if(user.balance < tournament.entry_fee){


throw new BadRequestException(

"Insufficient balance"

);


}







return this.prisma.$transaction(async(tx)=>{





await tx.user.update({

where:{

id:userId

},

data:{


balance:{

decrement:tournament.entry_fee

}


}


});









const slot =

await tx.tournamentSlot.findFirst({

where:{


tournament_id:tournamentId,


user_id:null


},

orderBy:{


id:"asc"

}


});







if(!slot){


throw new BadRequestException(

"No slots available"

);


}







await tx.tournamentSlot.update({

where:{

id:slot.id

},

data:{


user_id:userId,


joined_at:new Date()


}


});








return {


message:"Tournament joined successfully",


team_number:slot.team_number,


slot_number:slot.slot_number


};



});




}



}
