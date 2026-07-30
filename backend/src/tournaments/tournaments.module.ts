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





@Module({

imports:[

PrismaModule

],


controllers:[

TournamentsController

],



providers:[


TeamRoomService


]



})


export class TournamentsModule{}
