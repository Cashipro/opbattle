import {
Module
} from '@nestjs/common';



import {
PrismaModule
} from '../prisma/prisma.module';



import {
AdminTournamentController
} from './admin-tournament.controller';



import {
AdminTournamentService
} from './admin-tournament.service';



import {
TeamRoomService
} from '../tournaments/team-room.service';



import {
AutoPlannerService
} from '../tournaments/auto-planner.service';



import {
NextRoundService
} from '../tournaments/next-round.service';








@Module({

imports:[

PrismaModule

],





controllers:[

AdminTournamentController

],





providers:[



AdminTournamentService,


TeamRoomService,


AutoPlannerService,


NextRoundService



],





exports:[



AdminTournamentService



]



})


export class AdminTournamentModule {}
