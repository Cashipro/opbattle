import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PubgService } from './pubg.service';
import { PubgController } from './pubg.controller';

@Module({
  imports: [ConfigModule],
  providers: [PubgService],
  controllers: [PubgController],
  exports: [PubgService],
})
export class PubgModule {}
