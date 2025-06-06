import { Title } from 'src/titles/entities/title.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

/**
 * @Entity
 * Represents a comment made by a user on a title.
 * This entity contains properties such as subject, content, creation date,
 * and relationships with the user who made the comment and the title on which the comment was made.
 */

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  subject: string;

  @Column({ type: 'varchar', length: 250 })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Title, (title) => title.comments)
  title: Title;
}
