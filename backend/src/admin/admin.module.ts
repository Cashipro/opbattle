import {
Module
} from '@nestjs/common';



import {
PrismaModule
} from '../prisma/prisma.module';



import {
AdminTournamentController
} from './admin-tournament.controller';



import {
AdminTournamentService
} from './admin-tournament.service';






@Module({

imports:[

PrismaModule

],



controllers:[

AdminTournamentController

],



providers:[

AdminTournamentService

]



})


export class AdminModule{}
