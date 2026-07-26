import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tournament } from './tournament.entity';

@Entity('tournament_registrations')
export class TournamentRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tournament_id' })
  tournament_id: string;

  @Column({ name: 'team_id' })
  team_id: string;

  @Column({ default: 'PENDING' })
  status: string; // PENDING, APPROVED, REJECTED, CANCELLED

  @Column({ name: 'payment_status', default: 'PENDING' })
  payment_status: string; // PENDING, PAID, REFUNDED

  @Column({ name: 'entry_fee_paid', type: 'decimal', precision: 10, scale: 2, default: 0 })
  entry_fee_paid: number;

  @Column({ name: 'approved_by', nullable: true })
  approved_by: string;

  @Column({ name: 'approved_at', nullable: true })
  approved_at: Date;

  @Column({ name: 'position', nullable: true })
  position: number;

  @Column({ name: 'prize_won', type: 'decimal', precision: 10, scale: 2, default: 0 })
  prize_won: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.registrations)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @CreateDateColumn({ name: 'joined_at' })
  joined_at: Date;
}
