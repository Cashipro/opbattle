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



orderBy:{


team_number:'asc'


},



include:{



slots:{


orderBy:{


slot_number:'asc'


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









async createTeam(

tournamentId:string,

name:string

){





const count =

await this.prisma.tournamentTeam.count({

where:{


tournament_id:tournamentId


}

});






if(count >=25){


throw new BadRequestException(

"Maximum 25 teams allowed"

);


}







const team =

await this.prisma.tournamentTeam.create({

data:{


tournament_id:tournamentId,


team_number:count+1,


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









async joinSlot(

slotId:string,

userId:string

){





const existing =

await this.prisma.teamSlot.findFirst({

where:{


user_id:userId


}

});







if(existing){


await this.prisma.teamSlot.update({

where:{


id:existing.id


},


data:{


user_id:null


}


});


}









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
