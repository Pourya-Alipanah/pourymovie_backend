import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Episode } from './episode.entity';
import { Title } from './title.entity';

@Entity()
export class Season {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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
}
