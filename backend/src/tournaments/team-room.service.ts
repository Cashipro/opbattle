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









// AUTO CREATE TEAMS AFTER JOIN

async generateTeams(

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







const existing =

await this.prisma.tournamentTeam.count({

where:{


tournament_id:tournamentId


}

});







if(existing > 0){

throw new BadRequestException(

"Teams already generated"

);

}








for(

let i=1;

i<=tournament.total_teams;

i++

){





const team =

await this.prisma.tournamentTeam.create({

data:{


tournament_id:tournamentId,


team_number:i,


name:`Team ${i}`



}

});









for(

let slot=1;

slot<=4;

slot++

){



await this.prisma.teamSlot.create({

data:{


team_id:team.id,


slot_number:slot


}

});


}



}







return {

message:"Teams generated successfully",

teams:tournament.total_teams

};



}









// SHOW ROOM

async getRoom(

tournamentId:string

){



return this.prisma.tournamentTeam.findMany({

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



}









// EDIT TEAM NAME

async updateTeamName(

teamId:string,

name:string

){



if(!name){

throw new BadRequestException(

"Team name required"

);

}







return this.prisma.tournamentTeam.update({

where:{


id:teamId


},



data:{


name


}



});



}









// JOIN SLOT

async joinSlot(

slotId:string,

userId:string

){





const slot =

await this.prisma.teamSlot.findUnique({

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








// remove old slot

await this.prisma.teamSlot.updateMany({

where:{


user_id:userId


},



data:{


user_id:null


}



});









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









// LEAVE SLOT

async leaveSlot(

slotId:string

){



return this.prisma.teamSlot.update({

where:{


id:slotId


},



data:{


user_id:null


}



});



}








}
