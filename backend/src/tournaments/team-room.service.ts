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





// GET PUBG ROOM

async getRoom(
tournamentId:string,
userId:string
){


const joined =
await this.prisma.tournamentJoin.findUnique({

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

pubg_uid:true

}

}


}


}


}


});


}








// CREATE TEAMS

async createTeams(
tournamentId:string
){


const teams:any[]=[];



for(let i=1;i<=100;i++){


const team =
await this.prisma.tournamentTeam.create({

data:{


tournament_id:tournamentId,

team_number:i,

name:`Team ${i}`


}


});




for(let slot=1;slot<=4;slot++){


await this.prisma.teamSlot.create({

data:{


team_id:team.id,

slot_number:slot


}


});


}


teams.push(team);


}



return teams;


}









// INCREASE TEAMS

async increaseTeams(

tournamentId:string,

amount:number

){



const last =
await this.prisma.tournamentTeam.count({

where:{

tournament_id:tournamentId

}

});




const created=[];



for(
let i=1;
i<=amount;
i++
){


const number =
last+i;



const team =
await this.prisma.tournamentTeam.create({

data:{


tournament_id:tournamentId,

team_number:number,

name:`Team ${number}`


}

});





for(let slot=1;slot<=4;slot++){


await this.prisma.teamSlot.create({

data:{


team_id:team.id,

slot_number:slot


}


});


}



created.push(team);


}



return {

message:"Teams increased",

teams:created

};


}








// UPDATE TEAM NAME

async updateTeamName(

teamId:string,

name:string

){


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


user_id:null


}


});


}



}
