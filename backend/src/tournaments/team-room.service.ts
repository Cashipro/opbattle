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









// CREATE DEFAULT TEAMS

async createTeams(

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







const totalTeams = tournament.max_teams || 100;

const playersPerTeam = tournament.players_per_team || 4;








for(

let i=1;

i<=totalTeams;

i++

){



const exists =

await this.prisma.tournamentTeam.findFirst({

where:{

tournament_id:tournamentId,


team_number:i

}

});






if(exists){

continue;

}







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

slot<=playersPerTeam;

slot++

){



await this.prisma.teamSlot.create({

data:{


team_id:team.id,


slot_number:slot,


user_id:null


}

});



}



}








return {

message:"Teams created successfully"

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











// ADD MORE TEAMS

async increaseTeams(

tournamentId:string,

amount:number

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








const current =

await this.prisma.tournamentTeam.count({

where:{

tournament_id:tournamentId

}

});







const playersPerTeam =

tournament.players_per_team || 4;







const newTotal = current + amount;








for(

let i=current+1;

i<=newTotal;

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

slot<=playersPerTeam;

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


message:"Teams increased successfully",


oldTeams:current,


newTeams:newTotal


};



}











// UPDATE TEAM NAME

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

name

}



});



}









// REMOVE PLAYER FROM SLOT

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
