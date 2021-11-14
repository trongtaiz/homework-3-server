import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import SignUpDto from '@components/auth/dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserEntity from './entities/users.entity';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public async create(dto: SignUpDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.usersRepository.save(
      this.usersRepository.create({
        ...dto,
        password: hashedPassword,
      }),
    );
  }

  public async getUser(condition: Partial<UserEntity>) {
    return this.usersRepository.findOne({
      where: condition,
    });
  }
}