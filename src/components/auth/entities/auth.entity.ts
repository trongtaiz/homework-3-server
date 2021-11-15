import { AbstractEntity } from '@common/entities/abstract.entity';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity('Auth')
export default class AuthEntity extends AbstractEntity {
  @PrimaryColumn()
  userId!: string;

  @PrimaryColumn()
  hashedRefreshToken!: string;
}
