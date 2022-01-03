import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Classes } from './classes.entity';
import User from '@components/users/entities/users.entity';

@Entity('TeacherClass')
export class TeacherClass {
  @PrimaryColumn()
  class_id!: string;

  @PrimaryColumn()
  user_id!: string;

  @ManyToOne((type) => User, (users) => users.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @ManyToOne((type) => Classes, (classes) => classes.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'class_id' })
  public class!: Classes;
}
