import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { AdminTournamentService } from './admin-tournament.service';

import { AdminTournamentController } from './admin-tournament.controller';

import { TeamRoomService } from '../tournaments/team-room.service';

import { AutoPlannerService } from '../tournaments/auto-planner.service';

import { NextRoundService } from '../tournaments/next-round.service';


@Module({

imports:[],


controllers:[

AdminTournamentController

],


providers:[

PrismaService,

AdminTournamentService,

TeamRoomService,

AutoPlannerService,

NextRoundService

],


exports:[

AdminTournamentService

]

})


export class AdminModule {}import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { AdminTournamentService } from './admin-tournament.service';

import { AdminTournamentController } from './admin-tournament.controller';

import { TeamRoomService } from '../tournaments/team-room.service';

import { AutoPlannerService } from '../tournaments/auto-planner.service';

import { NextRoundService } from '../tournaments/next-round.service';


@Module({

imports:[],


controllers:[

AdminTournamentController

],


providers:[

PrismaService,

AdminTournamentService,

TeamRoomService,

AutoPlannerService,

NextRoundService

],


exports:[

AdminTournamentService

]

})


export class AdminModule {}
