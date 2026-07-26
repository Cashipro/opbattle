import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  user_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ name: 'held_balance', type: 'decimal', precision: 10, scale: 2, default: 0 })
  held_balance: number; // Locked for tournament entries

  @Column({ default: 'USD' })
  currency: string;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
