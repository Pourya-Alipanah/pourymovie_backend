import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Episode } from './episode.entity';
import { Title } from './title.entity';

@Entity()
export class VideoLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  url: string;

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
