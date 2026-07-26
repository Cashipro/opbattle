import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TeamMember } from './team-member.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'logo_url', nullable: true })
  logo_url: string;

  @Column({ name: 'captain_id' })
  captain_id: string;

  @Column({ name: 'game_id', nullable: true })
  game_id: string;

  @Column({ name: 'country_id', nullable: true })
  country_id: string;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  losses: number;

  @Column({ name: 'total_prize', type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_prize: number;

  @Column({ default: 0 })
  ranking: number;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @Column({ name: 'max_members', default: 4 })
  max_members: number;

  @OneToMany(() => TeamMember, (member) => member.team)
  members: TeamMember[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
