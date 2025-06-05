import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameFa: string;

  @Column()
  nameEn: string;

  @Column()
  slug: string;
}
