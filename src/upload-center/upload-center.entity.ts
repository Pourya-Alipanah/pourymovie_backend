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

@Entity('uploads')
export class UploadCenter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  fileKey: string;

  @Column()
  bucket: string;

  @Column({ type: 'enum', enum: UploadType })
  type: UploadType;

  @Column({ type: 'enum', enum: UploadStatus, default: UploadStatus.PENDING })
  status: UploadStatus;

  @Column({ type: 'enum', enum: UploadFromEntity, nullable: true })
  fromEntity: UploadFromEntity;

  @Column({ nullable: true })
  relatedEntityId: number;

  @CreateDateColumn()
  createdAt: Date;
}
