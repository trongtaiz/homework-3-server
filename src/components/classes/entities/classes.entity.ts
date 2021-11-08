import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Classes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  section: string;

  @Column()
  subject: string;

  @Column()
  room: string;
}
