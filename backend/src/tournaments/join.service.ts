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

"Tournament already started"

);

}








const alreadyJoined =

await this.prisma.tournamentJoin.findUnique({

where:{


tournament_id_user_id:{


tournament_id:tournamentId,


user_id:userId


}



}

});








if(alreadyJoined){

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








const join =

await tx.tournamentJoin.create({

data:{


tournament_id:tournamentId,


user_id:userId



}



});









await tx.walletTransaction.create({

data:{


user_id:userId,


type:"debit",


amount:tournament.entry_fee,


description:

`Tournament entry fee - ${tournament.name}`



}



});









return {


message:

"Tournament joined successfully",


join



};



});






}







}
