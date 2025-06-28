import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UploadType } from './enums/upload-type.enum';
import { UploadStatus } from './enums/upload-status.enum';
import { UploadFromEntity } from './enums/upload-from-entity.enum';
import {
  BufferBucketNames,
  StreamBucketNames,
} from './enums/bucket-names.enum';

@Entity('uploads')
export class UploadCenter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  fileKey: string;

  @Column({
    type: 'enum',
    enum: { ...BufferBucketNames, ...StreamBucketNames },
  })
  bucket: BufferBucketNames | StreamBucketNames;

  @Column({ type: 'enum', enum: UploadType, nullable: true })
  type: UploadType;

  @Column({ type: 'enum', enum: UploadStatus, default: UploadStatus.PENDING })
  status: UploadStatus;

  @Column({ type: 'enum', enum: UploadFromEntity, nullable: true })
  fromEntity: UploadFromEntity;

  @CreateDateColumn()
  createdAt: Date;
}
