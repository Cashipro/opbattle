import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';

import { TournamentsModule } from './tournaments/tournaments.module';

import { AdminTournamentModule } from './admin/admin-tournament.module';



@Module({

imports:[


ConfigModule.forRoot({

isGlobal:true

}),


PrismaModule,


AuthModule,


TournamentsModule,


AdminTournamentModule



]


})


export class AppModule {}
