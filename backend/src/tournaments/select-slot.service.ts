import {
  Injectable,
  BadRequestException
} from '@nestjs/common';


import {
  PrismaService
} from '../prisma/prisma.service';







@Injectable()
export class SelectSlotService {



constructor(

private prisma:PrismaService

){}









async selectSlot(

userId:string,

slotId:string

){



return this.prisma.$transaction(async(tx:any)=>{






const slot =

await tx.teamSlot.findUnique({

where:{

id:slotId

},


include:{


team:true


}


});








if(!slot){


throw new BadRequestException(

"Slot not found"

);

}








if(slot.user_id){


throw new BadRequestException(

"This slot is already occupied"

);

}









// CHECK USER ALREADY IN SAME TOURNAMENT

const oldSlot =

await tx.teamSlot.findFirst({

where:{


user_id:userId,


team:{


tournament_id:slot.team.tournament_id


}


}

});









// REMOVE OLD POSITION

if(oldSlot){


await tx.teamSlot.update({

where:{


id:oldSlot.id


},

data:{


user_id:null,


joined_at:null


}


});


}









// ASSIGN NEW POSITION

const updated =

await tx.teamSlot.update({

where:{


id:slotId


},

data:{


user_id:userId,


joined_at:new Date()


},


include:{


team:true,


user:{


select:{


id:true,


name:true,


pubg_uid:true


}


}


}


});









return {


message:"Slot selected successfully",


team:{


id:updated.team.id,


name:updated.team.name,


team_number:updated.team.team_number


},


slot:updated.slot_number,


player:updated.user


};






});



}







}
