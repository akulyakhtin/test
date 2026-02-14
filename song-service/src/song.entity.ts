import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'songs' })
export class SongEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  artist: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  album: string | null;

  // Store "MM:SS" as text (simple and reliable)
  @Column({ type: 'varchar', length: 10, nullable: true })
  duration: string | null;

  @Column({ type: 'varchar', length: 4, nullable: true })
  year: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
