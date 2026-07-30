import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { AdminController } from './admin.controller';

import { AdminTournamentService } from './admin-tournament.service';

import { TeamRoomService } from '../tournaments/team-room.service';


@Module({

  controllers:[
    AdminController
  ],


  providers:[

    PrismaService,

    AdminTournamentService,

    TeamRoomService

  ],


  exports:[

    AdminTournamentService

  ]


})

export class AdminModule {}
