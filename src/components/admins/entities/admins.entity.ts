import { AbstractEntity } from '@common/entities/abstract.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Admins')
export default class AdminsEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column()
  @Index({ fulltext: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  @Index({ fulltext: true })
  name!: string;
}
