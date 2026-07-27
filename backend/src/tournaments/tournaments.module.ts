import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { Tournament } from './tournament.entity';
import { TournamentRegistration } from './tournament-registration.entity';
import { TeamsModule } from '../teams/teams.module';
import { WalletModule } from '../wallet/wallet.module';
import { PlayersModule } from '../players/players.module';  // ✅ IMPORT

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament, TournamentRegistration]),
    TeamsModule,
    WalletModule,
    PlayersModule,  // ✅ YEH ADD KARO
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
  exports: [TournamentsService],
})
export class TournamentsModule {}
