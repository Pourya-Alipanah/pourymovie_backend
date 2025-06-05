import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VideoLink } from './video-link.entity';
import { Season } from './season.entity';

@Entity()
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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
