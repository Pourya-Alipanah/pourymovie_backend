import { TitlePerson } from 'src/titles/entities/title-person.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameFa: string;

  @Column()
  nameEn: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  deathDate: Date;

  @Column({ nullable: true })
  birthPlace: string;

  @Column({ nullable: true, length: 500 })
  imageUrl: string;

  @OneToMany(() => TitlePerson, (titlePerson) => titlePerson.person)
  titlePersons: TitlePerson[];
}
