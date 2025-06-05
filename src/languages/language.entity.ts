import { Title } from 'src/titles/entities/title.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameFa: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Title, (title) => title.language, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  titles: Title[];
}
