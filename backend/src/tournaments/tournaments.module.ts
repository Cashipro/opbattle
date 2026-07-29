import {
Module
} from '@nestjs/common';



import {
PrismaModule
} from '../prisma/prisma.module';



import {
TournamentsController
} from './tournaments.controller';



import {
TournamentsService
} from './tournaments.service';



import {
TeamRoomService
} from './team-room.service';



import {
PlannerService
} from './planner.service';



import {
MatchGeneratorService
} from './match-generator.service';



import {
MatchManagementService
} from './match-management.service';






@Module({

imports:[

PrismaModule

],



controllers:[

TournamentsController

],



providers:[

TournamentsService,

TeamRoomService,

PlannerService,

MatchGeneratorService,

MatchManagementService

]


})


export class TournamentsModule{}
