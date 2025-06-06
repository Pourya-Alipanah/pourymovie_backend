import { Title } from 'src/titles/entities/title.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

/**
 * @Entity
 * Represents a language in the system.
 * This entity contains properties such as the name in Persian,
 * a unique slug, and a one-to-many relationship with titles.
 */

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  nameFa: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  slug: string;

  @OneToMany(() => Title, (title) => title.language, {
    onDelete: 'CASCADE',
  })
  titles: Title[];
}
