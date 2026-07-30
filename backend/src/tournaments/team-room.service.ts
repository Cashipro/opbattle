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



return this.prisma.tournamentTeam.findMany({

where:{

tournament_id:tournamentId

},


include:{


slots:{


include:{


player:true


}


}


},



orderBy:{


team_number:'asc'


}



});


}









async createTeam(

tournamentId:string,

name:string

){



const lastTeam =

await this.prisma.tournamentTeam.findFirst({

where:{


tournament_id:tournamentId


},


orderBy:{


team_number:'desc'


}



});





const teamNumber =

lastTeam ?

lastTeam.team_number + 1 :

1;







if(teamNumber > 25){

throw new BadRequestException(

"Maximum 25 teams reached"

);

}








const team =

await this.prisma.tournamentTeam.create({

data:{


tournament_id:tournamentId,


team_number:teamNumber,


name:name


}



});







for(let i=1;i<=4;i++){



await this.prisma.teamSlot.create({

data:{


team_id:team.id,


slot_number:i


}



});



}






return team;



}









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






return this.prisma.teamSlot.update({

where:{


id:slotId


},


data:{


user_id:userId


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


user_id:null


}


});




}






}
