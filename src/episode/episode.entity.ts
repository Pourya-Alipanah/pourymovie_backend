import { Season } from 'src/season/season.entity';
import { VideoLink } from 'src/video-link/video-link.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * @Entity
 * Represents an episode in a season of a title.
 * This entity contains properties such as episode number,
 * a list of video links associated with the episode,
 */

@Entity()
@Index(['episodeNumber', 'season'], { unique: true })
export class Episode {
  /**
   * Unique identifier for the episode.
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The episode number within the season.
   * @type {number}
   */
  @Column({ type: 'int' })
  episodeNumber: number;

  /**
   * The title of the episode.
   * @type {string}
   */
  @OneToMany(() => VideoLink, (videoLink) => videoLink.episode, {
    cascade: true,
  })
  videoLinks: VideoLink[];

  /**
   * The season to which this episode belongs.
   * @type {Season}
   */
  @ManyToOne(() => Season, (season) => season.episodes, {
    onDelete: 'CASCADE',
  })
  season: Season;
}
