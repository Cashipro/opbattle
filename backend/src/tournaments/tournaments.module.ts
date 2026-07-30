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



import {
AutoPlannerService
} from './auto-planner.service';



import {
PlannerService
} from './planner.service';



import {
MatchGeneratorService
} from './match-generator.service';



import {
MatchManagementService
} from './match-management.service';



import {
NextRoundService
} from './next-round.service';



import {
QualificationService
} from './qualification.service';



import {
ResultService
} from './result.service';



import {
ResultBoardService
} from './result-board.service';







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


SelectSlotService,


AutoPlannerService,


PlannerService,


MatchGeneratorService,


MatchManagementService,


NextRoundService,


QualificationService,


ResultService,


ResultBoardService


],





exports:[


TeamRoomService,


JoinService,


TournamentsService,


ResultBoardService


]



})


export class TournamentsModule {}
