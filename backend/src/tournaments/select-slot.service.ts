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
user:true,
team:true
}


});







if(!slot){

throw new BadRequestException(
"Slot not found"
);

}







// AGAR KOI PEHLY SE BETHA HAI

if(slot.user_id){

throw new BadRequestException(
"Slot already occupied"
);

}







// USER KA PURANA SLOT REMOVE

await this.prisma.teamSlot.updateMany({

where:{

user_id:userId

},


data:{

user_id:null,

joined_at:null

}


});








// NAYA SLOT ASSIGN

const updated = await this.prisma.teamSlot.update({

where:{

id:slotId

},


data:{

user_id:userId,

joined_at:new Date()

},


include:{

user:true,

team:true

}


});








return {

message:"Slot selected",

team:updated.team,

slot:updated.slot_number,

user:updated.user

};



}







}
