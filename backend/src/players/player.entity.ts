import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  user_id: string;

  @Column({ name: 'pubg_uid', unique: true, nullable: true })
  pubg_uid: string;

  @Column({ name: 'player_name', nullable: true })
  player_name: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatar_url: string;

  @Column({ name: 'country_id', nullable: true })
  country_id: string;

  @Column({ name: 'device_type', nullable: true })
  device_type: string;

  @Column({ default: 1 })
  level: number;

  @Column({ nullable: true })
  rank: string;

  @Column({ name: 'season_tier', nullable: true })
  season_tier: string;

  @Column({ name: 'matches_played', default: 0 })
  matches_played: number;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  kills: number;

  @Column({ name: 'kd_ratio', type: 'decimal', precision: 5, scale: 2, default: 0 })
  kd_ratio: number;

  @Column({ name: 'tournament_played', default: 0 })
  tournament_played: number;

  @Column({ name: 'tournament_wins', default: 0 })
  tournament_wins: number;

  @Column({ name: 'total_winnings', type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_winnings: number;

  @Column({ name: 'verification_status', default: 'PENDING' })
  verification_status: string; // PENDING, APPROVED, REJECTED

  @Column({ name: 'verification_screenshot_url', nullable: true })
  verification_screenshot_url: string;

  @Column({ name: 'verified_by', nullable: true })
  verified_by: string;

  @Column({ name: 'verified_at', nullable: true })
  verified_at: Date;

  @Column({ default: false })
  is_banned: boolean;

  @Column({ name: 'ban_reason', nullable: true })
  ban_reason: string;

  @UpdateDateColumn({ name: 'last_updated' })
  last_updated: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
