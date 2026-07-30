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

await this.prisma.teamSlot.findUnique({

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








return this.prisma.$transaction(async(tx:any)=>{





// remove previous slot

await tx.teamSlot.updateMany({

where:{


user_id:userId


},



data:{


user_id:null,


joined_at:null


}



});








// assign new slot

const updated =

await tx.teamSlot.update({

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


team_id:slot.team_id,


slot_number:slot.slot_number,


slot:updated



};



});






}







}
