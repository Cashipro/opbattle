import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('live_streams')
export class LiveStream {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'tournament_id', nullable: true })
  tournament_id: string;

  @Column({ name: 'game_id', nullable: true })
  game_id: string;

  @Column({ name: 'country_id', nullable: true })
  country_id: string;

  @Column({ name: 'youtube_url' })
  youtube_url: string;

  @Column({ name: 'youtube_embed_url', nullable: true })
  youtube_embed_url: string;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnail_url: string;

  @Column({ default: 'SCHEDULED' })
  status: string; // SCHEDULED, LIVE, FINISHED, CANCELLED

  @Column({ name: 'scheduled_at', nullable: true })
  scheduled_at: Date;

  @Column({ name: 'started_at', nullable: true })
  started_at: Date;

  @Column({ name: 'ended_at', nullable: true })
  ended_at: Date;

  @Column({ name: 'viewer_count', default: 0 })
  viewer_count: number;

  @Column({ name: 'is_featured', default: false })
  is_featured: boolean;

  @Column({ name: 'created_by' })
  created_by: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
