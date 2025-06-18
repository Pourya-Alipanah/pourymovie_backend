import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VideoLink } from './video-link.entity';
import { Season } from '../../season/season.entity';

/**
 * @Entity
 * Represents an episode in a season of a title.
 * This entity contains properties such as episode number,
 * a list of video links associated with the episode,
 */

@Entity()
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  episodeNumber: number;

  @OneToMany(() => VideoLink, (videoLink) => videoLink.episode, {
    cascade: true,
  })
  videoLinks: VideoLink[];

  @ManyToOne(() => Season, (season) => season.episodes, {
    onDelete: 'CASCADE',
  })
  season: Season;
}
