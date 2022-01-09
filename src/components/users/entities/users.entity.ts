import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { AbstractEntity } from '@common/entities/abstract.entity';

@Entity('Users')
export default class UserEntity extends AbstractEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ nullable: true })
  @Index({ unique: true })
  studentId?: string;

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64, nullable: true })
  @Index({ fulltext: true })
  email?: string;

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64, nullable: true })
  password?: string;

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64, nullable: true })
  @Index({ fulltext: true })
  name?: string;

  @Column({ length: 64, nullable: true })
  @Index({ unique: true })
  fbId?: string;

  @Column({ length: 64, nullable: true })
  @Index({ unique: true })
  ggId?: string;

  @Column({ default: false })
  isActive!: boolean;

  @Column({ default: false })
  isLocked!: boolean;

  // @ApiProperty({ type: String, default: RolesEnum.STUDENT, enum: RolesEnum })
  // @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.STUDENT })
  // role!: RolesEnum;
}
