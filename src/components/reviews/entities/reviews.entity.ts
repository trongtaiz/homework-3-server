import { AbstractEntity } from '@common/entities/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import AssignmentOfStudentEntity from '../../assignments/entities/assignment-student.entity';

@Entity('Reviews')
export default class ReviewEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column()
  @Index()
  studentId!: string;

  @Column()
  @Index()
  assignmentId!: string;

  @Column()
  @Index()
  classId!: string;

  @Column()
  explanation?: string;

  @Column({ type: 'tinyint' })
  expectedGrade!: number;

  @Column({ nullable: true })
  finalGrade?: number;

  @OneToOne(() => AssignmentOfStudentEntity, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn([
    { name: 'studentId', referencedColumnName: 'studentId' },
    { name: 'assignmentId', referencedColumnName: 'assignmentId' },
  ])
  assignmentOfStudent?: AssignmentOfStudentEntity;
}
