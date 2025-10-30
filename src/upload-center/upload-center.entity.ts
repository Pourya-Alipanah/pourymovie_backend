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
  /**
   * Unique identifier for the upload record.
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Unique key of the uploaded file.
   * This key is used to identify the file in the storage bucket.
   * @type {string}
   */
  @Column()
  @Index()
  fileKey: string;

  /**
   * The bucket where the file is stored.
   * This can be either a buffer bucket or a stream bucket.
   * @type {BufferBucketNames | StreamBucketNames}
   */
  @Column({
    type: 'enum',
    enum: { ...BufferBucketNames, ...StreamBucketNames },
  })
  bucket: BufferBucketNames | StreamBucketNames;

  /**
   * The type of upload.
   * This indicates whether the upload is a buffer or a stream.
   * @type {UploadType}
   */
  @Column({ type: 'enum', enum: UploadType, nullable: true })
  type: UploadType;

  /**
   * The current status of the upload.
   * This indicates whether the upload is pending, completed, or failed.
   * @type {UploadStatus}
   */
  @Column({ type: 'enum', enum: UploadStatus, default: UploadStatus.PENDING })
  status: UploadStatus;

  /**
   * The entity from which the upload originated.
   * This can be a title, user, or other entities defined in the UploadFromEntity enum.
   * @type {UploadFromEntity}
   */
  @Column({ type: 'enum', enum: UploadFromEntity, nullable: true })
  fromEntity: UploadFromEntity;

  /**
   * Timestamp when the upload record was created.
   * This is automatically set to the current date and time when the record is created.
   * @type {Date}
   */
  @CreateDateColumn()
  createdAt: Date;
}
