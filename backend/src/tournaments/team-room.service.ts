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









const existingTeams =

await this.prisma.tournamentTeam.count({

where:{

tournament_id:tournamentId

}

});









// create only once

if(existingTeams === 0){





for(
let i=1;
i<=100;
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




}








// fill empty slots

const players =

await this.prisma.tournamentJoin.findMany({

where:{

tournament_id:tournamentId

},


include:{

user:true

}


});









for(const player of players){





const alreadyPlaced =

await this.prisma.teamSlot.findFirst({

where:{

user_id:player.user_id,

team:{
tournament_id:tournamentId
}

}

});







if(alreadyPlaced){

continue;

}









const emptySlot =

await this.prisma.teamSlot.findFirst({

where:{


user_id:null,


team:{


tournament_id:tournamentId


}


},


orderBy:{


created_at:"asc"


}


});







if(!emptySlot){

break;

}







await this.prisma.teamSlot.update({

where:{

id:emptySlot.id

},

data:{


user_id:player.user_id,


joined_at:new Date()


}


});





}









return {


message:"PUBG Room Updated",


totalTeams:100


};



}









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


name:name.trim()


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
