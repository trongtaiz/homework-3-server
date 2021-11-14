import {
  Column,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '@components/users/entities/users.entity';

@Entity('Classes')
export class Classes {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  section!: string;

  @Column()
  subject!: string;

  @Column()
  room!: string;

  @Column({ default: 1 })
  create_by!: number;

  @ManyToOne((type) => User, (users) => users.id)
  @JoinColumn({ name: 'create_by' })
  public user!: User;

  @Column()
  @Generated('uuid')
  invite_id!: string;
}
