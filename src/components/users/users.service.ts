import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import SignUpDto from '@components/auth/dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserEntity from './entities/users.entity';
import _ from 'lodash';
import UpdateUserDto from './dto/update-user.dto';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  getRepository() {
    return this.usersRepository;
  }

  public async create(dto: SignUpDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.usersRepository.save(
      this.usersRepository.create({
        ...dto,
        password: hashedPassword,
      }),
    );
  }

  public async getOrCreateOauthUser(
    type: string,
    userInfo: { id: string; email: string; name: string },
  ) {
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

    const foundUserBySocialId = await this.usersRepository.findOne({
      ...dynamicConditions,
    });

    if (!foundUserBySocialId) {
      const foundUserByEmail = await this.usersRepository.findOne({
        email: userInfo.email,
      });

      if (foundUserByEmail) {
        // update socialId
        await this.usersRepository.update(foundUserByEmail.id, {
          ...dynamicConditions,
        });

        return foundUserByEmail;
      }

      // create new one
      const newUser = await this.usersRepository.save(
        this.usersRepository.create({
          ...dynamicConditions,
          email: userInfo.email,
          name: userInfo.name,
          isActive: true,
        }),
      );

      return newUser;
    }

    return foundUserBySocialId;
  }

  public async getUser(condition: Partial<UserEntity>) {
    return this.usersRepository.findOne({
      where: condition,
    });
  }

  public async getUserInfo(userId: string) {
    const foundUser = await this.getUser({ id: userId });
    return _.pick(foundUser, ['email', 'name', 'id', 'studentId']);
  }

  public async updateUser(userId: string, dto: UpdateUserDto) {
    Logger.debug(userId);
    Logger.debug(JSON.stringify(dto));
    const updateResult = await this.usersRepository.update(userId, dto);
    if (updateResult.affected === 0) throw new BadRequestException();
    return true;
  }

  async isUserHasStudentId(userId: string, studentId: string) {
    const user = await this.usersRepository.findOne({ id: userId });

    return user!.studentId === studentId;
  }
}
