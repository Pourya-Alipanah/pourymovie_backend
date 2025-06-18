import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Title } from './title.entity';
import { VideoQuality } from '../enums/video-quality.enum';
import { Episode } from 'src/episode/episode.entity';

/**
 * Entity representing a video link associated with a title or episode.
 * It contains the URL of the video and its quality.
 * It can be linked to either an episode or a title.
 * @typedef {Object} VideoLink
 */
@Entity()
export class VideoLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'enum', enum: VideoQuality })
  quality: VideoQuality;

  @ManyToOne(() => Episode, (episode) => episode.videoLinks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  episode: Episode | null;

  @ManyToOne(() => Title, (title) => title.videoLinks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  title: Title | null;
}
