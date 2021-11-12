import { Entity, PrimaryColumn } from 'typeorm';

@Entity('Auth')
export default class AuthEntity {
  @PrimaryColumn()
  userId!: string;

  @PrimaryColumn()
  hashedRefreshToken!: string;
}
