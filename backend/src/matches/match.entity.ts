import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Tournament } from '../tournaments/tournament.entity';
import { MatchResult } from './match-result.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tournament_id' })
  tournament_id: string;

  @Column({ name: 'match_number' })
  match_number: number;

  @Column({ name: 'room_id', nullable: true })
  room_id: string;

  @Column({ name: 'room_password', nullable: true })
  room_password: string;

  @Column({ name: 'map_name', nullable: true })
  map_name: string;

  @Column({ name: 'perspective', nullable: true })
  perspective: string; // TPP, FPP

  @Column({ default: 'SCHEDULED' })
  status: string; // SCHEDULED, LIVE, COMPLETED, CANCELLED

  @Column({ name: 'started_at', nullable: true })
  started_at: Date;

  @Column({ name: 'completed_at', nullable: true })
  completed_at: Date;

  @Column({ name: 'results_added_by', nullable: true })
  results_added_by: string;

  @Column({ name: 'max_teams', default: 25 })
  max_teams: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.matches)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @OneToMany(() => MatchResult, (result) => result.match)
  results: MatchResult[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
