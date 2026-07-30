import {
Module
} from '@nestjs/common';


import {
ConfigModule
} from '@nestjs/config';


import {
PrismaModule
} from './prisma/prisma.module';


import {
AuthModule
} from './auth/auth.module';


import {
TournamentsModule
} from './tournaments/tournaments.module';


import {
AdminModule
} from './admin/admin.module';


import {
WithdrawalModule
} from './withdrawal/withdrawal.module';







@Module({

imports:[


ConfigModule.forRoot({

isGlobal:true

}),



PrismaModule,



AuthModule,



TournamentsModule,



AdminModule,



WithdrawalModule


]


})


export class AppModule {}
