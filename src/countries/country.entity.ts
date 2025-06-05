import { Title } from 'src/titles/entities/title.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameFa: string;

  @Column()
  nameEn: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Title, (title) => title.country, {
    onDelete: 'SET NULL',
  })
  title?: Title[];
}
