import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Episode } from './episode.entity';
import { Title } from './title.entity';

@Entity()
export class VideoLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Episode, (episode) => episode.videoLinks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  episode?: Episode;

  @ManyToOne(() => Title, (title) => title.videoLinks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  title?: Title;
}
