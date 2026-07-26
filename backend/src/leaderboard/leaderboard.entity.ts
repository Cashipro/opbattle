import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('leaderboard')
export class Leaderboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'player_id' })
  player_id: string;

  @Column({ name: 'country_id', nullable: true })
  country_id: string;

  @Column({ name: 'game_id', nullable: true })
  game_id: string;

  @Column({ name: 'total_points', default: 0 })
  total_points: number;

  @Column({ default: 0 })
  wins: number;

  @Column({ name: 'matches_played', default: 0 })
  matches_played: number;

  @Column({ default: 0 })
  kills: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  kd_ratio: number;

  @Column({ default: 0 })
  ranking: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_winnings: number;

  @Column({ name: 'tournaments_won', default: 0 })
  tournaments_won: number;

  @Column({ name: 'last_updated' })
  last_updated: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
