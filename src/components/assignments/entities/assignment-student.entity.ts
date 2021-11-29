import AllStudentsOfClassEntity from '@components/classes/entities/all-students-class.entity';
import {
  Column,
  Entity,
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
  classId!: string;

  @Column({ default: -1 })
  achievedPoint!: number;

  @ManyToOne(() => AllStudentsOfClassEntity, (std) => std.assignments, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn([
    { name: 'studentId', referencedColumnName: 'studentId' },
    { name: 'classId', referencedColumnName: 'classId' },
  ])
  student?: AllStudentsOfClassEntity;

  @OneToOne(() => AssignmentsEntity, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'assignmentId' })
  detail?: AssignmentsEntity;
}
