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

"This slot is already occupied"

);

}









// REMOVE USER FROM OLD SLOT

await this.prisma.teamSlot.updateMany({

where:{

user_id:userId

},

data:{

user_id:null,

joined_at:null

}

});









// ASSIGN NEW SLOT

const updated =

await this.prisma.teamSlot.update({

where:{

id:slotId

},

data:{


user_id:userId,


joined_at:new Date()


},


include:{


team:true,


user:true


}


});









return {


message:"Slot selected successfully",


team:updated.team,


slot:updated.slot_number



};



}






}
