import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TournamentRegistration } from './tournament-registration.entity';

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'game_id' })
  game_id: string;

  @Column({ name: 'country_id', nullable: true })
  country_id: string;

  @Column({ nullable: true })
  mode: string; // SOLO, DUO, SQUAD

  @Column({ name: 'entry_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  entry_fee: number;

  @Column({ name: 'prize_pool', type: 'decimal', precision: 10, scale: 2, default: 0 })
  prize_pool: number;

  @Column({ name: 'max_teams' })
  max_teams: number;

  @Column({ name: 'min_teams', default: 2 })
  min_teams: number;

  @Column({ name: 'current_teams', default: 0 })
  current_teams: number;

  @Column({ name: 'start_date' })
  start_date: Date;

  @Column({ name: 'registration_deadline' })
  registration_deadline: Date;

  @Column({ default: 'UPCOMING' })
  status: string; // UPCOMING, LIVE, COMPLETED, CANCELLED

  @Column({ type: 'text', nullable: true })
  rules: string;

  @Column({ name: 'prize_distribution', type: 'text', nullable: true })
  prize_distribution: string;

  @Column({ name: 'created_by' })
  created_by: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => TournamentRegistration, (registration) => registration.tournament)
  registrations: TournamentRegistration[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
