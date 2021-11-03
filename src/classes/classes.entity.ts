import { Column, Entity, PrimaryColumn, ObjectIdColumn } from 'typeorm';

@Entity()
export class Classes {
  @PrimaryColumn()
  @ObjectIdColumn()
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
