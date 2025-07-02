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

/**
 * Entity representing an upload record in the upload center.
 * Stores metadata about uploaded files, including their keys, buckets,
 * types, statuses, and the entity from which they originated.
 * This entity is used to track uploads in the system
 * and ensure uniqueness of file keys within their respective buckets.
 * @class UploadCenter
 * @version 1
 * @description This entity represents an upload record in the upload center,
 * including details such as file key, bucket, type, status, and origin entity.
 * It is used to manage and track file uploads in the system.
 * @property {number} id - Unique identifier for the upload record.
 * @property {string} fileKey - Unique key of the uploaded file.
 * @property {BufferBucketNames | StreamBucketNames} bucket - The bucket where the file is stored.
 * @property {UploadType} type - The type of upload (e.g., buffer, stream).
 * @property {UploadStatus} status - The current status of the upload (e.g., pending, completed).
 * @property {UploadFromEntity} fromEntity - The entity from which the upload originated (e.g., title, user).
 * @property {Date} createdAt - Timestamp when the upload record was created.
 */
@Index(['fileKey', 'bucket'], { unique: true })
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
