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







// CREATE DEFAULT 100 TEAMS

async createTeams(

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





const totalTeams = tournament.max_teams || 100;

const slotsPerTeam = tournament.players_per_team || 4;





for(let i=1;i<=totalTeams;i++){



const teamExist = await this.prisma.tournamentTeam.findFirst({

where:{

tournament_id:tournamentId,

team_number:i

}

});



if(teamExist){

continue;

}




const team = await this.prisma.tournamentTeam.create({

data:{

tournament_id:tournamentId,

team_number:i,

name:`Team ${i}`

}

});





for(let s=1;s<=slotsPerTeam;s++){


await this.prisma.teamSlot.create({

data:{

team_id:team.id,

slot_number:s

}

});


}



}





return {

message:"Teams created successfully"

};


}









// GET TEAM ROOM

async getRoom(

tournamentId:string,

userId:string

){



const joined = await this.prisma.tournamentJoin.findUnique({

where:{

tournament_id_user_id:{

tournament_id:tournamentId,

user_id:userId

}

}

});





if(!joined){

throw new BadRequestException(

"You have not joined this tournament"

);

}







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

pubg_uid:true,

profile_pic:true

}

}

}


}


}



});



}









// INCREASE TEAMS

async increaseTeams(

tournamentId:string,

amount:number

){



const current = await this.prisma.tournamentTeam.count({

where:{

tournament_id:tournamentId

}

});





for(

let i=current+1;

i<=current+amount;

i++

){



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

message:"Teams increased",

total:current+amount

};


}









// UPDATE TEAM NAME

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
