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

TeamRoomService

],





exports:[

TournamentsService

]



})


export class TournamentsModule {}
