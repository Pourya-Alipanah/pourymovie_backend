import {
  Column,
  Entity,
  Index,
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
@Index(['seasonNumber', 'title'], { unique: true })
export class Season {
  /**
   * Unique identifier for the season.
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The season number within the title.
   * @type {number}
   */
  @Column({ type: 'int' })
  seasonNumber: number;

  /**
   * The title of the season.
   * @type {string}
   */
  @OneToMany(() => Episode, (episode) => episode.season)
  episodes: Episode[];

  /**
   * The title to which this season belongs.
   * @type {Title}
   */
  @ManyToOne(() => Title, (title) => title.seasons, {
    onDelete: 'CASCADE',
  })
  title: Title;

  /**
   * Indicates if this season is a special season.
   * @type {boolean}
   */
  @Column({
    type: 'boolean',
    default: false,
  })
  specialSeason: boolean;

  /**
   * Name of the special season, if applicable.
   * This field is nullable, meaning it can be null if the season is not a special season.
   * @type {string | null}
   */
  @Column({ type: 'varchar', nullable: true })
  specialSeasonName: string | null;
}
