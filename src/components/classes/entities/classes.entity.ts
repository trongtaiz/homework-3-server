import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Classes')
export class Classes {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  section!: string;

  @Column()
  subject!: string;

  @Column()
  room!: string;
}
