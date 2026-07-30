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







// CREATE TEAMS AFTER USERS JOIN

async generateTeams(

tournamentId:string

){



const tournament =

await this.prisma.tournament.findUnique({

where:{

id:tournamentId

},

include:{

joins:true

}

});





if(!tournament){

throw new BadRequestException(
"Tournament not found"
);

}







if(!tournament.joins.length){

throw new BadRequestException(
"No players joined"
);

}







const existing =

await this.prisma.tournamentTeam.count({

where:{

tournament_id:tournamentId

}

});







if(existing){

throw new BadRequestException(
"Teams already generated"
);

}







const players = tournament.joins;






let teamNumber = 1;

let index = 0;






while(index < players.length){



const team =

await this.prisma.tournamentTeam.create({

data:{


tournament_id:tournamentId,


team_number:teamNumber,


name:`Team ${teamNumber}`


}

});







for(let slot=1; slot<=4; slot++){



const player = players[index];



await this.prisma.teamSlot.create({

data:{


team_id:team.id,


slot_number:slot,


user_id:player?.user_id || null,


joined_at:player ? new Date() : null


}

});



index++;




if(index >= players.length){

break;

}



}





teamNumber++;





}







return {


message:"Teams generated successfully",


totalTeams:teamNumber-1



};



}









// PUBG ROOM VIEW

async getRoom(

tournamentId:string

){



const teams =

await this.prisma.tournamentTeam.findMany({

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







return teams;



}









// CHANGE TEAM NAME

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









// SELECT SLOT

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







await this.prisma.teamSlot.updateMany({

where:{


user_id:userId


},

data:{


user_id:null,


joined_at:null


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









async leaveSlot(

slotId:string

){



return this.prisma.teamSlot.update({

where:{

id:slotId

},

data:{


user_id:null,


joined_at:null


}

});



}



}
