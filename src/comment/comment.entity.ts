import { Exclude } from 'class-transformer';
import { Title } from 'src/titles/entities/title.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VirtualColumn,
} from 'typeorm';
import { DeletedBy } from './enums/deleted-by.enum';

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

  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updateAt: Date | null;

  @Exclude()
  @Column({ type: 'enum', enum: DeletedBy, nullable: true })
  deletedBy: DeletedBy | null;

  @VirtualColumn({
    type: 'boolean',
    query: (alias) => `${alias}."createdAt" <> ${alias}."updateAt"`,
  })
  isUpdated: boolean;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Title, (title) => title.comments)
  title: Title;
}
