import {
Injectable
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';





@Injectable()

export class AdminStatsService {



constructor(

private prisma:PrismaService

){}






async getStats(){



const [

users,

tournaments,

teams,

matches,

pendingDeposits,

approvedDeposits

] = await Promise.all([



this.prisma.user.count(),



this.prisma.tournament.count(),



this.prisma.tournamentTeam.count(),



this.prisma.tournamentMatch.count(),



this.prisma.deposit.count({

where:{

status:"pending"

}

}),



this.prisma.deposit.count({

where:{

status:"approved"

}

})



]);






return {


users,


tournaments,


teams,


matches,


pendingDeposits,


approvedDeposits


};



}



}
