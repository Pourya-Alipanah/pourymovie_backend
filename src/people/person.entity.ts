import { TitlePerson } from 'src/titles/entities/title-person.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

/**
 * @Entity
 * Represents a person in the system, such as an actor, director, or writer.
 * This entity contains properties such as name in Persian and English,
 * a unique slug, birth and death dates, birth place, image URL,
 */

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nameFa: string;

  @Column({ type: 'varchar', length: 100 })
  nameEn: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  slug: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ type: 'date', nullable: true })
  deathDate: Date | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  birthPlace: string | null;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  imageUrl: string | null;

  @OneToMany(() => TitlePerson, (titlePerson) => titlePerson.person)
  titlePersons: TitlePerson[] | null;
}
