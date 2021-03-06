import UploadedStudentsEntity from '@components/classes/entities/uploaded-students.entity';
import ReviewEntity from '@components/reviews/entities/reviews.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import AssignmentsEntity from './assignments.entity';

@Entity('AssignmentOfStudent')
export default class AssignmentOfStudentEntity {
  @PrimaryColumn()
  assignmentId!: string;

  @PrimaryColumn()
  studentId!: string;

  @Column()
  @Index()
  classId!: string;

  @Column({ default: -1 })
  achievedPoint!: number;

  @ManyToOne(() => UploadedStudentsEntity, (std) => std.assignments, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn([
    { name: 'studentId', referencedColumnName: 'studentId' },
    { name: 'classId', referencedColumnName: 'classId' },
  ])
  student?: UploadedStudentsEntity;

  @OneToOne(() => AssignmentsEntity, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'assignmentId' })
  detail?: AssignmentsEntity;

  @OneToOne(() => ReviewEntity, (review) => review.assignmentOfStudent, {
    createForeignKeyConstraints: false,
  })
  review?: ReviewEntity;
}
