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







// AUTO CREATE TEAMS

async generateTeams(

tournamentId:string

){



const tournament = await this.prisma.tournament.findUnique({

where:{
id:tournamentId
}

});



if(!tournament){

throw new BadRequestException(
"Tournament not found"
);

}





const count = await this.prisma.tournamentTeam.count({

where:{
tournament_id:tournamentId
}

});





if(count > 0){

throw new BadRequestException(
"Teams already generated"
);

}





for(let i=1;i<=tournament.total_teams;i++){



const team = await this.prisma.tournamentTeam.create({

data:{


tournament_id:tournamentId,


team_number:i,


name:`Team ${i}`


}

});





for(let s=1;s<=4;s++){


await this.prisma.teamSlot.create({

data:{


team_id:team.id,


slot_number:s


}

});


}



}






return {

message:"Teams generated successfully",

totalTeams:tournament.total_teams

};


}









// GET PUBG ROOM

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







return teams.map(team=>({



id:team.id,


team_number:team.team_number,


name:team.name || `Team ${team.team_number}`,



slots:team.slots.map(slot=>({


id:slot.id,


slot_number:slot.slot_number,


user:slot.user



}))



}));



}









// UPDATE TEAM NAME

async updateTeamName(

teamId:string,

name:string

){



if(!name || name.trim().length < 3){

throw new BadRequestException(

"Team name minimum 3 characters required"

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









// JOIN SLOT

async joinSlot(

slotId:string,

userId:string

){



const slot = await this.prisma.teamSlot.findUnique({

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
