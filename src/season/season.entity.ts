import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Title } from '../titles/entities/title.entity';
import { Episode } from 'src/episode/episode.entity';

/**
 * @Entity
 * Represents a season of a title.
 * This entity contains properties such as season number,
 * a list of episodes in the season,
 * a reference to the title it belongs to,
 */

@Entity()
export class Season {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  seasonNumber: number;

  @OneToMany(() => Episode, (episode) => episode.season)
  episodes: Episode[];

  @ManyToOne(() => Title, (title) => title.seasons, {
    onDelete: 'CASCADE',
  })
  title: Title;

  @Column({
    type: 'boolean',
    default: false,
  })
  specialSeason: boolean;

  @Column({ type: 'varchar', nullable: true })
  specialSeasonName: string | null;
}
