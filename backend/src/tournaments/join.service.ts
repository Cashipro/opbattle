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







if(tournament.status !== "upcoming"){

throw new BadRequestException(

"Tournament entry closed"

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





// balance cut

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








// find empty slot

let slot =

await tx.tournamentSlot.findFirst({

where:{


tournament_id:tournamentId,


user_id:null


},


orderBy:{


team_number:"asc"


}


});








if(!slot){


throw new BadRequestException(

"No available slots"

);


}








// assign player

await tx.tournamentSlot.update({

where:{


id:slot.id


},


data:{


user_id:userId,


joined_at:new Date()


}


});









// wallet history

await tx.walletTransaction.create({

data:{


user_id:userId,


type:"tournament_entry",


amount:tournament.entry_fee,


description:

`Joined ${tournament.name}`



}


});









return {


message:

"Tournament joined successfully",


tournament:tournament.name,


team_number:slot.team_number,


slot_number:slot.slot_number


};



});






}






}
