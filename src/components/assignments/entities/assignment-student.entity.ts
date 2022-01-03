import UploadedStudentsEntity from '@components/classes/entities/uploaded-students.entity';
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

  @Column({ default: false })
  isFinalized!: boolean;

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
}
