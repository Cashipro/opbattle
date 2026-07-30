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









async getRoom(

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









async leaveSlot(

slotId:string

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









// ADMIN OPTIONAL
// agar admin teams increase karna chahe


async increaseTeams(

tournamentId:string,

amount:number

){





const lastTeam =

await this.prisma.tournamentTeam.findFirst({

where:{

tournament_id:tournamentId

},


orderBy:{

team_number:"desc"

}

});







let start =

lastTeam

?

lastTeam.team_number + 1

:

1;








const created:any[]=[];








for(

let t=start;

t<start+amount;

t++

){





const team =

await this.prisma.tournamentTeam.create({

data:{

tournament_id:tournamentId,

team_number:t,

name:`Team ${t}`

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





created.push(team);



}








return {


message:"Teams added successfully",

total:created.length



};



}








}
