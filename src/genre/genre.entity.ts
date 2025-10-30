import { Title } from 'src/titles/entities/title.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

/**
 * @Entity
 * Represents a genre in the system.
 * This entity contains properties such as name in Persian and English,
 * a unique slug, and a many-to-many relationship with titles.
 */

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nameFa: string;

  @Column({ type: 'varchar', length: 50 })
  nameEn: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  slug: string;

  @ManyToMany(() => Title, (title) => title.genres)
  titles: Title[];
}
