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

@Entity('UploadedStudents')
export default class UploadedStudentsEntity {
  @PrimaryColumn()
  studentId!: string;

  @PrimaryColumn()
  classId!: string;

  @Column({ nullable: true })
  fullName?: string;

  @ManyToOne(() => UserEntity, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'studentId', referencedColumnName: 'studentId' })
  studentAccount?: UserEntity;

  @OneToMany(
    () => AssignmentOfStudentEntity,
    (assignment) => assignment.student,
    {
      createForeignKeyConstraints: false,
    },
  )
  assignments?: AssignmentOfStudentEntity;
}
