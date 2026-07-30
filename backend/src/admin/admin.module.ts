import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { AdminTournamentController } from './admin-tournament.controller';

import { AdminTournamentService } from './admin-tournament.service';

import { TournamentsModule } from '../tournaments/tournaments.module';

import { AutoPlannerService } from '../tournaments/auto-planner.service';

import { NextRoundService } from '../tournaments/next-round.service';



@Module({

imports:[

PrismaModule,

TournamentsModule

],


controllers:[

AdminTournamentController

],


providers:[

AdminTournamentService,

AutoPlannerService,

NextRoundService

],


exports:[

AdminTournamentService

]


})

export class AdminModule {}
