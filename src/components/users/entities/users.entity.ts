import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { RolesEnum } from '@decorators/roles.decorator';
import { AbstractEntity } from '@common/entities/abstract.entity';

@Entity('Users')
export default class UserEntity extends AbstractEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  @Index({ unique: true })
  username!: string;

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  password!: string;

  // @ApiProperty({ type: String, default: RolesEnum.STUDENT, enum: RolesEnum })
  // @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.STUDENT })
  // role!: RolesEnum;
}
