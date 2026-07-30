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
  private prisma: PrismaService
){}






// CREATE 100 PUBG STYLE TEAMS

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






const already =

await this.prisma.tournamentTeam.count({

where:{
tournament_id:tournamentId
}

});





if(already){

return {
message:"Teams already created"
};

}








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








// CREATE 4 EMPTY SLOTS

for(
let slot=1;
slot<=4;
slot++
){



await this.prisma.teamSlot.create({

data:{


team_id:team.id,


slot_number:slot,


user_id:null,


joined_at:null


}

});


}



}








return {


message:"100 Teams created successfully",


teams:100,


slots:400


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











// UPDATE TEAM NAME

async updateTeamName(

teamId:string,

name:string

){


if(!name || name.length < 3){

throw new BadRequestException(

"Team name minimum 3 characters"

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











// LEAVE SLOT

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
