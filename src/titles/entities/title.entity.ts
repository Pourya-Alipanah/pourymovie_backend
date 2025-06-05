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
import { Country } from 'src/countries/country.entity';
import { Season } from './season.entity';
import { VideoLink } from './video-link.entity';
import { TitleType } from '../enums/title-type.enum';
import { TitlePerson } from './title-person.entity';
import { PersonRole } from 'src/people/enums/person-role.enum';
import { Language } from 'src/languages/language.entity';

@Entity()
export class Title {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TitleType,
  })
  type: TitleType;

  @Column()
  titleFa: string;

  @Column()
  @Index()
  titleEn: string;

  @Column()
  @Index({ unique: true })
  slug: string;

  @Column()
  releaseYear: number;

  @Column()
  durationMinutes: number;

  @Column({ type: 'number', nullable: true })
  imdbRating: number;

  @Column({ nullable: true })
  imdbVotes: number;

  @Column({ default: false })
  isTop250: boolean;

  @Column({ nullable: true })
  top250Rank: number;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @ManyToOne(() => Language, (language) => language.titles, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  language: Language;

  @ManyToMany(() => Genre)
  @JoinTable()
  genres: Genre[];

  get actors() {
    return (
      this.titlePersons
        ?.filter((tp) => tp.role === PersonRole.Actor)
        .map((tp) => tp.person) || []
    );
  }

  get directors() {
    return (
      this.titlePersons
        ?.filter((tp) => tp.role === PersonRole.Director)
        .map((tp) => tp.person) || []
    );
  }

  get writers() {
    return (
      this.titlePersons
        ?.filter((tp) => tp.role === PersonRole.Writer)
        .map((tp) => tp.person) || []
    );
  }

  @ManyToOne(() => Country)
  country: Country;

  @Column()
  ageRating: string;

  @Column({ default: false })
  hasSubtitle: boolean;

  @Column({ nullable: true })
  awards: string;

  @OneToMany(() => Season, (season) => season.title, {
    nullable: true,
    cascade: true,
  })
  seasons: Season[];

  @OneToMany(() => VideoLink, (videoLink) => videoLink.title, {
    nullable: true,
    cascade: true,
  })
  videoLinks: VideoLink[];

  @OneToMany(() => TitlePerson, (titlePerson) => titlePerson.title, {
    cascade: true,
  })
  titlePersons: TitlePerson[];
}
