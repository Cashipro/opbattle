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
AdminDepositController
} from './admin-deposit.controller';



import {
AdminDepositService
} from './admin-deposit.service';





import {
AdminStatsController
} from './admin-stats.controller';



import {
AdminStatsService
} from './admin-stats.service';





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


AdminTournamentController,


AdminDepositController,


AdminStatsController


],





providers:[


AdminTournamentService,


AdminDepositService,


AdminStatsService,


AutoPlannerService,


NextRoundService


]


})


export class AdminModule{}
