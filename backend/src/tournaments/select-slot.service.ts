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









return this.prisma.$transaction(async(tx)=>{






// Remove previous slot if user changed team

await tx.teamSlot.updateMany({

where:{


user_id:userId


},



data:{


user_id:null,


joined_at:null


}



});









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


team_number:slot.team.team_number,


team_name:slot.team.name,


slot_number:updated.slot_number



};






});






}







}
