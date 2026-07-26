import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('withdrawals')
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'bank_name' })
  bank_name: string;

  @Column({ name: 'account_number' })
  account_number: string;

  @Column({ name: 'account_holder_name' })
  account_holder_name: string;

  @Column({ name: 'bank_code', nullable: true })
  bank_code: string;

  @Column({ default: 'PENDING' })
  status: string; // PENDING, PROCESSING, COMPLETED, REJECTED

  @Column({ name: 'processed_by', nullable: true })
  processed_by: string;

  @Column({ name: 'processed_at', nullable: true })
  processed_at: Date;

  @Column({ name: 'rejected_reason', nullable: true })
  rejected_reason: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
