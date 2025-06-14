import { Exclude } from 'class-transformer';
import { Comment } from 'src/comment/comment.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './enums/user-role.enum';

/**
 * User entity representing a user in the system.
 * @class User
 * @version 1
 * @description This entity represents a user in the system with various attributes such as name, email, password, and subscription status.
 * @property {number} id - Unique identifier for the user.
 * @property {string} firstName - First name of the user.
 * @property {string} lastName - Last name of the user.
 * @property {string} email - Email address of the user.
 * @property {Date} createdAt - Timestamp when the user was created.
 * @property {Date} updateAt - Timestamp when the user was last updated.
 * @property {Date} deletedAt - Timestamp when the user was deleted.
 * @property {boolean} hasSubscription - Indicates if the user has an active subscription.
 * @property {Subscription} activeSubscription - Active subscription of the user.
 * @property {Subscription[]} subscriptionHistory - History of subscriptions for the user.
 * @property {Payment[]} paymentHistory - History of payments for the user.
 * @property {string} password - Password of the user, excluded from serialization.
 * @property {string} resetPasswordToken - Token for resetting the password, excluded from serialization.
 * @property {Date | null} resetPasswordTokenExpires - Expiration date for the reset password token, excluded from serialization.
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  firstName: string | null;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  lastName: string | null;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  avatarUrl: string | null;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
  })
  @Exclude()
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date | null;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  resetPasswordToken: string | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  @Exclude()
  resetPasswordTokenExpires: Date | null;

  @Column({
    type: 'boolean',
    default: false,
  })
  hasSubscription: boolean;

  @OneToMany(()=> Comment , comment => comment.user)
  comments: Comment[];

  /* @OneToOne(() => Subscription, { eager: true, nullable: true })
    @JoinColumn()
    activeSubscription: Subscription; */

  /* @OneToMany(() => Subscription)
  @JoinColumn()
  subscriptionHistory: Subscription[]; */

  /* @OneToMany(() => Payment)
    @JoinColumn()
    paymentHistory: Payment[]; */
}
