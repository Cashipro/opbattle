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
TeamRoomService
} from './team-room.service';



import {
JoinService
} from './join.service';



import {
TournamentsService
} from './tournaments.service';



import {
MyTournamentsService
} from './my-tournaments.service';



import {
SelectSlotService
} from './select-slot.service';






@Module({

imports:[

PrismaModule

],



controllers:[

TournamentsController

],



providers:[


TeamRoomService,


JoinService,


TournamentsService,


MyTournamentsService,


SelectSlotService


],



exports:[


TeamRoomService,


JoinService,


TournamentsService


]



})


export class TournamentsModule {}
