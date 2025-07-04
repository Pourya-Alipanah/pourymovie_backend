import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Episode } from 'src/episode/episode.entity';
import { VideoQuality } from 'src/titles/enums/video-quality.enum';
import { Title } from 'src/titles/entities/title.entity';

/**
 * Entity representing a video link associated with a title or episode.
 * It contains the URL of the video and its quality.
 * It can be linked to either an episode or a title.
 * @typedef {Object} VideoLink
 */
@Entity()
/**
 * @Entity
 * Represents a video link in the database.
 * This entity contains properties such as URL, quality,
 * and associations with episodes or titles.
 * It is used to store video links for episodes or titles.
 * @class VideoLink
 */
@Index(['quality', 'episode'], { unique: true })
@Index(['quality', 'title'], { unique: true })
export class VideoLink {
  /**
   * Unique identifier for the video link.
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * URL of the video link.
   * @type {string}
   */
  @Column({ type: 'varchar', length: 500 })
  url: string;

  /**
   * Quality of the video link.
   * @type {VideoQuality}
   */
  @Column({ type: 'enum', enum: VideoQuality })
  quality: VideoQuality;

  /**
   * The episode to which this video link belongs.
   * This field is nullable, meaning the video link may not be associated with an episode.
   * @type {Episode | null}
   */
  @ManyToOne(() => Episode, (episode) => episode.videoLinks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  episode: Episode | null;

  /**
   * The title to which this video link belongs.
   * This field is nullable, meaning the video link may not be associated with a title.
   * @type {Title | null}
   */
  @ManyToOne(() => Title, (title) => title.videoLinks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  title: Title | null;
}
