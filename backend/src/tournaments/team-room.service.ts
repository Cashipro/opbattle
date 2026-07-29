import {
Injectable
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';




@Injectable()

export class TeamRoomService {


constructor(

private prisma:PrismaService

){}






async createTeams(

tournamentId:string

){



const existing =

await this.prisma.tournamentTeam.count({

where:{

tournament_id:tournamentId

}

});



if(existing){

return;

}






for(let team=1; team<=25; team++){



const newTeam =

await this.prisma.tournamentTeam.create({

data:{


tournament_id:tournamentId,


team_number:team,


team_name:`Team ${team}`


}

});






for(let slot=1;slot<=4;slot++){



await this.prisma.tournamentSlot.create({

data:{


tournament_id:tournamentId,


team_id:newTeam.id,


slot_number:slot


}


});


}



}



return {


message:"25 Teams Created"


};



}








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


user:true


}


}


},


orderBy:{


team_number:"asc"

}


});


}





}
