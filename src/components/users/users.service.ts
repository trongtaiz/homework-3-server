import * as bcrypt from 'bcrypt';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import SignUpDto from '@components/auth/dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserEntity from './entities/users.entity';
import _ from 'lodash';

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

  public async getOrCreateOauthUser(type: string, userInfo: { id: string }) {
    let dynamicConditions: { [key: string]: string } = {};

    switch (type) {
      case 'fb':
        dynamicConditions.fbId = userInfo.id;
        break;
      case 'gg':
        dynamicConditions.ggId = userInfo.id;
        break;
      default:
        throw new InternalServerErrorException();
    }

    const foundUser = await this.usersRepository.findOne({
      ...dynamicConditions,
    });

    if (!foundUser) {
      // create new one
      const newUser = await this.usersRepository.save(
        this.usersRepository.create(dynamicConditions),
      );

      return newUser;
    }

    return foundUser;
  }

  public async getUser(condition: Partial<UserEntity>) {
    return this.usersRepository.findOne({
      where: condition,
    });
  }

  public async getUserInfo(userId: string) {
    const foundUser = await this.getUser({ id: userId });

    return _.omit(foundUser, ['password', 'id']);
  }
}
