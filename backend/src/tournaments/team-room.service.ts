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









// CHANGE TEAM NAME

async updateTeamName(

teamId:string,

name:string

){



if(

!name ||

name.trim().length < 3

){


throw new BadRequestException(

"Team name too short"

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









// ADMIN INCREASE TEAMS

async increaseTeams(

tournamentId:string,

amount:number

){



if(amount <= 0){


throw new BadRequestException(

"Invalid team amount"

);


}








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








for(

let slot=1;

slot<=4;

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


message:"Teams increased successfully",


added:amount



};



}



}
