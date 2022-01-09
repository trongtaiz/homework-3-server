import {
  Column,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import User from '@components/users/entities/users.entity';
import AssignmentEntity from '@components/assignments/entities/assignments.entity';
import { AbstractEntity } from '@common/entities/abstract.entity';

@Entity('Classes')
export class Classes extends AbstractEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column()
  @Index({ fulltext: true })
  name!: string;

  @Column()
  section!: string;

  @Column()
  subject!: string;

  @Column()
  room!: string;

  @Column({ default: 1 })
  create_by!: number;

  @ManyToOne((type) => User, (users) => users.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'create_by' })
  public user!: User;

  @OneToMany(() => AssignmentEntity, (assignment) => assignment.class, {
    createForeignKeyConstraints: false,
  })
  assignments?: AssignmentEntity[];

  @Column()
  @Generated('uuid')
  invite_id!: string;
}
