import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'resources' })
export class ResourceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Raw MP3 bytes
  @Column({ type: 'bytea' })
  data: Buffer;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
