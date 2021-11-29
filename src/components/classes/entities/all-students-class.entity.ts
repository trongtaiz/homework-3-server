import AssignmentOfStudentEntity from '@components/assignments/entities/assignment-student.entity';
import UserEntity from '@components/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { StudentClass } from './studentClass.entity';

@Entity('AllStudentsOfClass')
export default class AllStudentsOfClassEntity {
  @PrimaryColumn()
  studentId!: string;

  @PrimaryColumn()
  classId!: string;

  @Column({ nullable: true })
  fullName?: string;

  @ManyToOne(() => StudentClass, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'studentId', referencedColumnName: 'student_id' })
  studentAccount?: StudentClass;

  @OneToMany(
    () => AssignmentOfStudentEntity,
    (assignment) => assignment.student,
  )
  assignments?: AssignmentOfStudentEntity;
}
