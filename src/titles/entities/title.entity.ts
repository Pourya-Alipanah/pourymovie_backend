import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from './genre.entity';
import { Country } from 'src/titles/entities/country.entity';
import { Season } from './season.entity';
import { VideoLink } from './video-link.entity';
import { TitleType } from '../enums/title-type.enum';
import { TitlePerson } from './title-person.entity';
import { PersonRole } from 'src/people/enums/person-role.enum';
import { Language } from 'src/titles/entities/language.entity';
import { Comment } from 'src/comment/comment.entity';

/**
 * @Entity
 * Represents a title in the system, which can be a movie, series, or documentary.
 * This entity contains various properties such as title, release year, duration,
 * IMDB ratings, and relationships with genres, countries, seasons, video links,
 * and title persons (actors, directors, writers).
 */

@Entity()
export class Title {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TitleType,
  })
  type: TitleType;

  @Column({ type: 'varchar', length: 100 })
  titleFa: string;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  titleEn: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  slug: string;

  @Column({ type: 'int' })
  releaseYear: number;

  @Column({ type: 'int' })
  durationMinutes: number;

  @Column({ type: 'int', nullable: true })
  imdbRating: number | null;

  @Column({ type: 'int', nullable: true })
  imdbVotes: number | null;

  @Column({ type: 'boolean', default: false })
  isTop250: boolean;

  @Column({ type: 'int', nullable: true })
  top250Rank: number | null;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  summary: string | null;

  @Column({ type: 'varchar', length: 10 })
  ageRating: string;

  @Column({ type: 'boolean', default: false })
  hasSubtitle: boolean;

  @Column({ type: 'varchar', nullable: true })
  awards: string | null;

  @ManyToOne(() => Language, (language) => language.titles, {
    onDelete: 'SET NULL',
    eager: true,
  })
  language: Language;

  @ManyToMany(() => Genre)
  @JoinTable()
  genres: Genre[];

  /**
   * Returns an array of actors associated with the title.
   * @returns {Person[]}
   */
  get actors() {
    return (
      this.titlePersons
        ?.filter((tp) => tp.role === PersonRole.Actor)
        .map((tp) => tp.person) || []
    );
  }

  /**
   * Returns an array of directors associated with the title.
   * @return {Person[]}
   */
  get directors() {
    return (
      this.titlePersons
        ?.filter((tp) => tp.role === PersonRole.Director)
        .map((tp) => tp.person) || []
    );
  }

  /**
   * Returns an array of writers associated with the title.
   * @return {Person[]}
   */
  get writers() {
    return (
      this.titlePersons
        ?.filter((tp) => tp.role === PersonRole.Writer)
        .map((tp) => tp.person) || []
    );
  }

  @ManyToOne(() => Country, { eager: true })
  country: Country;

  @OneToMany(() => Season, (season) => season.title, {
    cascade: true,
  })
  seasons: Season[];

  @OneToMany(() => VideoLink, (videoLink) => videoLink.title, {
    cascade: true,
  })
  videoLinks: VideoLink[];

  @OneToMany(() => TitlePerson, (titlePerson) => titlePerson.title, {
    cascade: true,
  })
  titlePersons: TitlePerson[];

  @OneToMany(() => Comment, (comment) => comment.title)
  comments: Comment[];
}
