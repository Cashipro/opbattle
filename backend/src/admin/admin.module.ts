import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { PlayersModule } from '../players/players.module';
import { TeamsModule } from '../teams/teams.module';
import { TournamentsModule } from '../tournaments/tournaments.module';
import { MatchesModule } from '../matches/matches.module';
import { WalletModule } from '../wallet/wallet.module';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { LiveStreamModule } from '../livestream/livestream.module';
import { User } from '../users/user.entity';
import { Player } from '../players/player.entity';
import { Team } from '../teams/team.entity';
import { Tournament } from '../tournaments/tournament.entity';
import { Match } from '../matches/match.entity';
import { Wallet } from '../wallet/wallet.entity';
import { Transaction } from '../wallet/transaction.entity';
import { Withdrawal } from '../wallet/withdrawal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Player, Team, Tournament, Match, Wallet, Transaction, Withdrawal]),
    UsersModule,
    PlayersModule,
    TeamsModule,
    TournamentsModule,
    MatchesModule,
    WalletModule,
    LeaderboardModule,
    NotificationsModule,
    LiveStreamModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
