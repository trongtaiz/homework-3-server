import { AbstractEntity } from '@common/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Notifications')
export class Notifications extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  message!: string;

  @Column()
  subject!: string;

  @Column()
  classId!: string;

  @Column()
  link!: string;

  @Column()
  receiverId!: string;

  @Column()
  seen: boolean = false;
}
