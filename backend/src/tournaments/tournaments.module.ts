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
JoinService
} from './join.service';



import {
TeamRoomService
} from './team-room.service';



import {
SelectSlotService
} from './select-slot.service';



import {
MyTournamentsService
} from './my-tournaments.service';







@Module({

imports:[

PrismaModule

],



controllers:[

TournamentsController

],



providers:[

TournamentsService,

JoinService,

TeamRoomService,

SelectSlotService,

MyTournamentsService

]



})


export class TournamentsModule {}
