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
PlannerService
} from './planner.service';


import {
MatchGeneratorService
} from './match-generator.service';


import {
MatchManagementService
} from './match-management.service';


import {
ResultService
} from './result.service';


import {
QualificationService
} from './qualification.service';






@Module({

imports:[

PrismaModule

],



controllers:[

TournamentsController

],



providers:[


TournamentsService,


PlannerService,


MatchGeneratorService,


MatchManagementService,


ResultService,


QualificationService


]


})


export class TournamentsModule{}
