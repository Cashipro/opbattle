import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { AdminTournamentService } from './admin-tournament.service';

import { TeamRoomService } from '../tournaments/team-room.service';


@Module({

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
