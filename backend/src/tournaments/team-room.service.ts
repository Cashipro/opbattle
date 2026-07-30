import {
Injectable,
BadRequestException
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';





@Injectable()

export class TeamRoomService {


constructor(

private prisma:PrismaService

){}









// GET PUBG STYLE ROOM

async getRoom(

tournamentId:string

){



const teams = await this.prisma.tournamentTeam.findMany({

where:{

tournament_id:tournamentId

},


orderBy:{

team_number:"asc"

},


include:{


slots:{


orderBy:{

slot_number:"asc"

},


include:{


user:{


select:{


id:true,

name:true,

pubg_uid:true


}


}


}



}



}



});







if(!teams.length){


throw new BadRequestException(

"No teams available"

);

}



return teams;



}









// USER SELECT SLOT

async selectSlot(

userId:string,

slotId:string

){



const slot = await this.prisma.teamSlot.findUnique({

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








// REMOVE OLD SLOT

await this.prisma.teamSlot.updateMany({

where:{


user_id:userId


},


data:{


user_id:null,


joined_at:null


}



});









// ADD NEW SLOT

return this.prisma.teamSlot.update({

where:{


id:slotId


},


data:{


user_id:userId,


joined_at:new Date()


}



});



}









// LEAVE TEAM SLOT

async leaveSlot(

userId:string

){



return this.prisma.teamSlot.updateMany({

where:{


user_id:userId


},


data:{


user_id:null,


joined_at:null


}



});



}









// CHANGE TEAM NAME ADMIN

async updateTeamName(

teamId:string,

name:string

){



if(!name || name.length < 3){

throw new BadRequestException(

"Team name too short"

);

}







return this.prisma.tournamentTeam.update({

where:{


id:teamId


},


data:{


name:name.trim()


}



});



}



}
