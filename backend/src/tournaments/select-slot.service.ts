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

"Slot already occupied"

);

}








const tournament =

await this.prisma.tournament.findUnique({

where:{


id:slot.team.tournament_id


}



});







if(!tournament){

throw new BadRequestException(

"Tournament not found"

);

}







if(tournament.status !== "upcoming"){


throw new BadRequestException(

"Slot selection closed"

);


}









return this.prisma.$transaction(async(tx)=>{





// remove old slot from same tournament

await tx.tournamentSlot.updateMany({

where:{


user_id:userId,


team:{


tournament_id:slot.team.tournament_id


}


},



data:{


user_id:null,


joined_at:null


}


});









// assign new slot

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


message:

"Slot selected successfully",



team_id:

slot.team.id,



team_number:

slot.team.team_number,



team_name:

slot.team.name,



slot_number:

updated.slot_number



};





});






}



}
