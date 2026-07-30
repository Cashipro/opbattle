import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';

import { TournamentsModule } from './tournaments/tournaments.module';

import { AdminModule } from './admin/admin.module';

import { DepositModule } from './deposit/deposit.module';



@Module({

imports:[

ConfigModule.forRoot({
  isGlobal:true
}),


PrismaModule,


AuthModule,


TournamentsModule,


AdminModule,


DepositModule


]

})

export class AppModule {}
