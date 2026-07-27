import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { Player } from './player.entity';
import { PubgModule } from '../pubg/pubg.module';  // ✅ IMPORT PUBG MODULE

@Module({
  imports: [
    TypeOrmModule.forFeature([Player]),
    PubgModule,  // ✅ YEH ADD KARO
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
