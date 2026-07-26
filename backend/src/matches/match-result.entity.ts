import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Match } from './match.entity';

@Entity('match_results')
export class MatchResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'match_id' })
  match_id: string;

  @Column({ name: 'team_id' })
  team_id: string;

  @Column()
  position: number;

  @Column({ default: 0 })
  kills: number;

  @Column({ default: 0 })
  points: number;

  @Column({ name: 'prize_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  prize_amount: number;

  @Column({ name: 'is_winner', default: false })
  is_winner: boolean;

  @Column({ default: false })
  verified: boolean;

  @Column({ name: 'verified_by', nullable: true })
  verified_by: string;

  @Column({ name: 'verified_at', nullable: true })
  verified_at: Date;

  @ManyToOne(() => Match, (match) => match.results)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
