import {
Injectable,
BadRequestException
} from '@nestjs/common';



import {
PrismaService
} from '../prisma/prisma.service';






@Injectable()

export class NextRoundService {



constructor(

private prisma:PrismaService

){}









async generateNextRound(

tournamentId:string

){





const rounds =

await this.prisma.tournamentRound.findMany({

where:{

tournament_id:tournamentId

},



orderBy:{


round_number:"desc"


}



});







if(!rounds.length){

throw new BadRequestException(

"No previous round found"

);

}







const lastRound = rounds[0];








const existing =

await this.prisma.tournamentRound.findFirst({

where:{


tournament_id:tournamentId,


round_number:lastRound.round_number + 1


}

});







if(existing){

throw new BadRequestException(

"Next round already exists"

);

}









const matches =

await this.prisma.tournamentMatch.findMany({

where:{


round_id:lastRound.id


},



include:{


results:{


orderBy:{


points:"desc"


}


}

}



});







let qualifiedTeams:any[] = [];








for(const match of matches){



const topTeams = match.results.slice(

0,

10

);



qualifiedTeams.push(...topTeams);



}







if(!qualifiedTeams.length){

throw new BadRequestException(

"No qualified teams"

);

}









const nextRound =

await this.prisma.tournamentRound.create({

data:{


tournament_id:tournamentId,


round_number:lastRound.round_number + 1,


name:`Round ${lastRound.round_number + 1}`


}

});








let index = 0;

let matchNumber = 1;

const matchLimit = 25;







while(index < qualifiedTeams.length){



const match =

await this.prisma.tournamentMatch.create({

data:{


tournament_id:tournamentId,


round_id:nextRound.id,


match_number:matchNumber,


status:"pending"


}

});







const teams = qualifiedTeams.slice(

index,

index + matchLimit

);








for(const item of teams){



await this.prisma.matchTeam.create({

data:{


match_id:match.id,


team_id:item.team_id


}

});



}







index += matchLimit;


matchNumber++;



}








return {


message:"Next round generated successfully",


round:nextRound.name,


qualifiedTeams:qualifiedTeams.length


};



}






}
