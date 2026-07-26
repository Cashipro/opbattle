import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveStreamController } from './livestream.controller';
import { LiveStreamService } from './livestream.service';
import { LiveStream } from './livestream.entity';
import { TournamentsModule } from '../tournaments/tournaments.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LiveStream]),
    TournamentsModule,
    UsersModule,
  ],
  controllers: [LiveStreamController],
  providers: [LiveStreamService],
  exports: [LiveStreamService],
})
export class LiveStreamModule {}
