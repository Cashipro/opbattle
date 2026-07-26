import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @Column()
  type: string; // TOURNAMENT_STARTED, VERIFICATION_COMPLETED, ROOM_RELEASED, RESULT_PUBLISHED, PRIZE_SENT, TEAM_INVITE, WITHDRAWAL_STATUS

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'is_read', default: false })
  is_read: boolean;

  @Column({ name: 'read_at', nullable: true })
  read_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // Store related data like tournament_id, match_id, etc.

  @Column({ name: 'action_url', nullable: true })
  action_url: string;

  @Column({ name: 'is_email_sent', default: false })
  is_email_sent: boolean;

  @Column({ name: 'email_sent_at', nullable: true })
  email_sent_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
