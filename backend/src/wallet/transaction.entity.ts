import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'wallet_id' })
  wallet_id: string;

  @Column()
  type: string; // DEPOSIT, WITHDRAWAL, FEE, REWARD, REFUND

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'PENDING' })
  status: string; // PENDING, COMPLETED, FAILED, CANCELLED

  @Column({ name: 'reference_id', nullable: true })
  reference_id: string; // Payment gateway reference

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ name: 'completed_at', nullable: true })
  completed_at: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
