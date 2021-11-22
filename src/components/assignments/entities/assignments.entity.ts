import { AbstractEntity } from '@common/entities/abstract.entity';
import { Classes } from '@components/classes/entities/classes.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Assignments')
export default class AssignmentsEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column()
  @Index()
  classId!: string;

  @ManyToOne(() => Classes, (classroom) => classroom.assignments, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'classId' })
  class?: Classes;

  @Column()
  title!: string;

  @Column()
  point!: number;

  @Column()
  order!: number;
}
