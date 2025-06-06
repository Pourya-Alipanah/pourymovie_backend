import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Title } from 'src/titles/entities/title.entity';
import { Person } from 'src/people/person.entity';
import { PersonRole } from 'src/people/enums/person-role.enum';

/**
 * @Entity
 * Represents a relationship between a title and a person (actor, director, writer, etc.).
 * This entity contains properties such as the role of the person in the title
 * and relationships with the title and person entities.
 */

@Entity()
export class TitlePerson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type:'enum',
    enum: PersonRole
  })
  role: PersonRole

  @ManyToOne(() => Title, (title) => title.titlePersons, { onDelete: 'CASCADE' })
  title: Title;

  @ManyToOne(() => Person, (person) => person.titlePersons, { onDelete: 'CASCADE' })
  person: Person;

}
