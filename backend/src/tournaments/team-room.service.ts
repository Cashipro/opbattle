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









// CREATE PUBG ROOM WITH 100 TEAMS

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









const existing =

await this.prisma.tournamentTeam.count({

where:{
tournament_id:tournamentId
}

});







if(existing){

return {

message:"Teams already created"

};

}









let playerIndex = 0;



// CREATE 100 TEAMS

for(
let teamNumber = 1;
teamNumber <= 100;
teamNumber++
){



const team =

await this.prisma.tournamentTeam.create({

data:{


tournament_id:tournamentId,


team_number:teamNumber,


name:`Team ${teamNumber}`


}

});









// 4 SLOTS EACH TEAM

for(
let slotNumber = 1;
slotNumber <= 4;
slotNumber++
){



let userId = null;

let joinedAt = null;






if(
tournament.joins[playerIndex]
){


userId =
tournament.joins[playerIndex].user_id;


joinedAt =
new Date();



playerIndex++;


}







await this.prisma.teamSlot.create({

data:{


team_id:team.id,


slot_number:slotNumber,


user_id:userId,


joined_at:joinedAt


}


});





}




}








return {

message:"100 PUBG teams created",

teams:100


};



}









// GET PUBG ROOM

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









// SELECT PLAYER SLOT

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









// REMOVE OLD POSITION

await this.prisma.teamSlot.updateMany({

where:{

user_id:userId

},

data:{

user_id:null,

joined_at:null

}

});









// ADD NEW POSITION

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
