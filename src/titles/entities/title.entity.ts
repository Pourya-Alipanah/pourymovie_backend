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
import { Exclude, Expose } from 'class-transformer';

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

  @Column({ type: 'float', nullable: true })
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

  @Column({ type: 'varchar', nullable: true })
  trailerUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  coverUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl: string | null;

  @ManyToOne(() => Language, (language) => language.titles, {
    onDelete: 'SET NULL',
    eager: true,
  })
  language: Language | null;

  @ManyToMany(() => Genre)
  @JoinTable()
  genres: Genre[] | null;

  /**
   * Returns an array of actors associated with the title.
   * @returns {Person[]}
   */
  @Expose()
  get actors() {
    return (
      this.people
        ?.filter((tp) => tp.role === PersonRole.ACTOR)
        .map((tp) => tp.person) || []
    );
  }

  /**
   * Returns an array of directors associated with the title.
   * @return {Person[]}
   */
  @Expose()
  get directors() {
    return (
      this.people
        ?.filter((tp) => tp.role === PersonRole.DIRECTOR)
        .map((tp) => tp.person) || []
    );
  }

  /**
   * Returns an array of writers associated with the title.
   * @return {Person[]}
   */
  @Expose()
  get writers() {
    return (
      this.people
        ?.filter((tp) => tp.role === PersonRole.WRITER)
        .map((tp) => tp.person) || []
    );
  }

  @ManyToOne(() => Country, { eager: true })
  country: Country | null;

  @OneToMany(() => Season, (season) => season.title, {
    cascade: true,
  })
  seasons: Season[] | null;

  @OneToMany(() => VideoLink, (videoLink) => videoLink.title, {
    cascade: true,
  })
  videoLinks: VideoLink[] | null;

  @Exclude()
  @OneToMany(() => TitlePerson, (titlePerson) => titlePerson.title, {
    cascade: true,
  })
  people: TitlePerson[] | null;

  @OneToMany(() => Comment, (comment) => comment.title)
  comments: Comment[];
}
