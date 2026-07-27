import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TestAuthController } from './test.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'opbattle_super_secret_key_2026',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController, TestAuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
