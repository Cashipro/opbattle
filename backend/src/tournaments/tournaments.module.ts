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
SelectSlotService
} from './select-slot.service';


import {
PlannerService
} from './planner.service';


import {
MatchGeneratorService
} from './match-generator.service';





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

SelectSlotService,

PlannerService,

MatchGeneratorService

]


})


export class TournamentsModule{}
