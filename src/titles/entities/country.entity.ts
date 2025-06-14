import { Title } from 'src/titles/entities/title.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


/**
 * @Entity
 * Represents a country in the system.
 * This entity contains properties such as name in Persian and English,
 * a unique slug, and a relationship with titles associated with the country.
 */

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nameFa: string;

  @Column({ type: 'varchar', length: 50 })
  nameEn: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Title, (title) => title.country, {
    onDelete: 'SET NULL',
  })
  title?: Title[];
}
