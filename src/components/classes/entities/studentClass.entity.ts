import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Classes } from './classes.entity';
import User from '@components/users/entities/users.entity';

@Entity('StudentClass')
export class StudentClass {
  @PrimaryColumn()
  class_id!: number;

  @PrimaryColumn()
  user_id!: string;

  // @Column({ nullable: true })
  // student_id?: string;

  @ManyToOne((type) => User, (users) => users.id)
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @ManyToOne((type) => Classes, (classes) => classes.id)
  @JoinColumn({ name: 'class_id' })
  public class!: Classes;
}
