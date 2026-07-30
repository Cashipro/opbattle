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



const slot = await this.prisma.teamSlot.findUnique({

where:{

id:slotId

},



include:{


team:{


include:{


tournament:true


}


}



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









// REMOVE USER FROM OLD POSITION

await this.prisma.teamSlot.updateMany({

where:{


user_id:userId


},



data:{


user_id:null,


joined_at:null


}



});









// ADD USER TO NEW SLOT

const updated = await this.prisma.teamSlot.update({

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


message:"Position selected successfully",



team:{


id:updated.team.id,


name:updated.team.name,


team_number:updated.team.team_number


},



slot_number:updated.slot_number,



player:updated.user



};



}









}
