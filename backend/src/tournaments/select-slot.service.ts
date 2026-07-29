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






const slot =

await this.prisma.tournamentSlot.findUnique({

where:{

id:slotId

}

});





if(!slot){

throw new BadRequestException(

"Slot not found"

);

}






if(slot.user_id){


throw new BadRequestException(

"Slot already occupied"

);


}









return this.prisma.$transaction(async(tx)=>{






// REMOVE OLD SLOT

await tx.tournamentSlot.updateMany({

where:{


user_id:userId,


tournament_id:slot.tournament_id


},


data:{


user_id:null,


joined_at:null


}


});







// ASSIGN NEW SLOT

const updated =

await tx.tournamentSlot.update({

where:{

id:slotId

},


data:{


user_id:userId,


joined_at:new Date()


}



});







return {

message:"Slot selected successfully",

team_id:updated.team_id,

slot_number:updated.slot_number


};





});





}



}
