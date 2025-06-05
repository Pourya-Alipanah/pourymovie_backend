import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Title } from 'src/titles/entities/title.entity';
import { Person } from 'src/people/person.entity';
import { PersonRole } from 'src/people/enums/person-role.enum';

@Entity()
export class TitlePerson {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Title, (title) => title.titlePersons, { onDelete: 'CASCADE' })
  title: Title;

  @ManyToOne(() => Person, (person) => person.titlePersons, { onDelete: 'CASCADE' })
  person: Person;

  @Column({
    type:'enum',
    enum: PersonRole
  })
  role: PersonRole
}
