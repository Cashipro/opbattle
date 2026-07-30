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








if(
tournament.status !== "upcoming"
){


throw new BadRequestException(

"Tournament joining closed"

);

}









const already =

await this.prisma.tournamentJoin.findUnique({

where:{

tournament_id_user_id:{

tournament_id:tournamentId,

user_id:userId

}

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









if(
user.balance < tournament.entry_fee
){


throw new BadRequestException(

"Insufficient balance"

);

}









return this.prisma.$transaction(async(tx:any)=>{






// DEDUCT ENTRY FEE

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









// CREATE JOIN RECORD

const join =

await tx.tournamentJoin.create({

data:{

tournament_id:tournamentId,

user_id:userId

}

});









// WALLET HISTORY

await tx.walletTransaction.create({

data:{

user_id:userId,

type:"TOURNAMENT_ENTRY",

amount:-tournament.entry_fee,

currency:tournament.currency,

description:

`Joined ${tournament.name}`

}

});









// FIND EMPTY SLOT

const emptySlot =

await tx.teamSlot.findFirst({

where:{


user_id:null,


team:{


tournament_id:tournamentId


}


},


orderBy:{


created_at:"asc"


}

});









// AUTO ASSIGN SLOT

if(emptySlot){



await tx.teamSlot.update({

where:{

id:emptySlot.id

},

data:{


user_id:userId,


joined_at:new Date()


}


});



}









return {


message:"Tournament joined successfully",


join_id:join.id,


team_room:

emptySlot
?
"ready"
:
"waiting"


};



});





}



}
