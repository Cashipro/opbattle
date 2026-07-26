import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Team } from './team.entity';

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'team_id' })
  team_id: string;

  @Column({ name: 'player_id' })
  player_id: string;

  @Column({ name: 'is_captain', default: false })
  is_captain: boolean;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @Column({ name: 'joined_at' })
  joined_at: Date;

  @ManyToOne(() => Team, (team) => team.members)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
