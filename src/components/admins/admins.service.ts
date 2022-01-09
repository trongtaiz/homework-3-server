import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AdminSignInDto from './dto/admin-sign-in.dto';
import AdminsEntity from './entities/admins.entity';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import _ from 'lodash';
import CreateAdminDto from './dto/create-admin.dto';
import GetAllAdminsDto from './dto/get-all-admins.dto';
import GetAdminDetailDto from './dto/get-admin-detail.dto';
import moment from 'moment';
import GetAllUsersDto from './dto/get-all-user.dto';
import UserEntity from '@components/users/entities/users.entity';
import GetUserDetailDto from './dto/get-user-detail.dto';
import MapStudentIdDto from './dto/map-student-id.dto';
import LockUserDto from './dto/lock-user.dto';
import { Classes as ClassesEntity } from '@components/classes/entities/classes.entity';
import GetClassDetailDto from './dto/get-class-detail.dto';
import GetAllClassesDto from './dto/get-all-classes.dto';
@Injectable()
export default class AdminsService implements OnModuleInit {
  constructor(
    @InjectRepository(AdminsEntity)
    private readonly adminsRepository: Repository<AdminsEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ClassesEntity)
    private readonly classesRepository: Repository<ClassesEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const rootAdminEmail = process.env.ADMIN_ROOT_EMAIL!;

    console.log(rootAdminEmail);

    const rootAdmin = await this.adminsRepository.findOne({
      email: rootAdminEmail,
    });

    if (rootAdmin) return;

    // create root admin
    const rootAdminPassword = process.env.ADMIN_ROOT_PASSWORD!;

    const hashedPassword = bcrypt.hashSync(rootAdminPassword, 10);
    await this.adminsRepository.save(
      this.adminsRepository.create({
        email: rootAdminEmail,
        password: hashedPassword,
      }),
    );
  }

  async signIn(dto: AdminSignInDto) {
    const admin = await this.adminsRepository.findOne({
      email: dto.email,
    });

    if (!admin) throw new UnauthorizedException();
    if (!bcrypt.compareSync(dto.password, admin.password))
      throw new UnauthorizedException();

    return {
      accessToken: this.jwtService.sign(
        { id: admin.id },
        {
          secret: process.env.ADMIN_JWT_SECRET!,
          expiresIn: 7 * 24 * 60 * 60 * 1000,
        },
      ),
    };
  }

  async createAdmin(dto: CreateAdminDto) {
    const admin = await this.adminsRepository.findOne({ email: dto.email });

    if (admin)
      throw new BadRequestException('This email has already been used');

    const hashedPassword = bcrypt.hashSync(dto.password, 10);

    const newAdmin = await this.adminsRepository.save(
      this.adminsRepository.create({
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      }),
    );

    return _.omit(newAdmin, ['password']);
  }

  async getAllAdmins(dto: GetAllAdminsDto) {
    let page = dto.page || 1;
    let pageSize = dto.pageSize || 10;

    const query = this.adminsRepository.createQueryBuilder('admin');

    if (dto.keyword)
      query
        .where(`MATCH(email) AGAINST ('${dto.keyword}' IN BOOLEAN MODE)`)
        .orWhere(`MATCH(name) AGAINST ('${dto.keyword}' IN BOOLEAN MODE)`);

    if (dto.sortBy) {
      if (dto.sortBy.startsWith('-'))
        query.orderBy(dto.sortBy.slice(1), 'DESC');
      else {
        if (dto.sortBy.startsWith('+'))
          query.orderBy(dto.sortBy.slice(1), 'ASC');
        else query.orderBy(dto.sortBy, 'ASC');
      }
    }

    const [data, totalRecords] = await query
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .getManyAndCount();

    return {
      data: data.map((e) => ({
        ..._.omit(e, ['password']),
        createdAt: moment(e.createdAt).format('YYYY-MM-DD'),
      })),
      pageInfo: {
        pageIndex: page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalRecords / pageSize),
        totalRecords,
      },
    };
  }

  async getAdminDetail(dto: GetAdminDetailDto) {
    const admin = await this.adminsRepository.findOne({ id: dto.adminId });
    if (!admin) throw new NotFoundException();
    return {
      ..._.omit(admin, ['password']),
      createdAt: moment(admin.createdAt).format('YYYY-MM-DD'),
    };
  }

  async getAllUsers(dto: GetAllUsersDto) {
    let page = dto.page || 1;
    let pageSize = dto.pageSize || 10;

    const query = this.usersRepository.createQueryBuilder('user');

    if (dto.keyword)
      query
        .where(`MATCH(email) AGAINST ('${dto.keyword}' IN BOOLEAN MODE)`)
        .orWhere(`MATCH(name) AGAINST ('${dto.keyword}' IN BOOLEAN MODE)`);

    if (dto.sortBy) {
      if (dto.sortBy.startsWith('-'))
        query.orderBy(dto.sortBy.slice(1), 'DESC');
      else {
        if (dto.sortBy.startsWith('+'))
          query.orderBy(dto.sortBy.slice(1), 'ASC');
        else query.orderBy(dto.sortBy, 'ASC');
      }
    }

    const [data, totalRecords] = await query
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .getManyAndCount();

    return {
      data: data.map((e) => ({
        ..._.omit(e, ['password']),
        createdAt: moment(e.createdAt).format('YYYY-MM-DD'),
      })),
      pageInfo: {
        pageIndex: page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalRecords / pageSize),
        totalRecords,
      },
    };
  }

  async getUserDetail(dto: GetUserDetailDto) {
    const user = await this.usersRepository.findOne({ id: dto.userId });
    if (!user) throw new NotFoundException();
    return {
      ..._.omit(user, ['password']),
      createdAt: moment(user.createdAt).format('YYYY-MM-DD'),
    };
  }

  async mapStudentId(dto: MapStudentIdDto) {
    return this.usersRepository.save({
      id: dto.userId,
      studentId: dto.studentId || undefined,
    });
  }

  async lockUser(dto: LockUserDto) {
    return this.usersRepository.save({
      id: dto.userId,
      isLocked: dto.isLocked,
    });
  }

  async getAllClasses(dto: GetAllClassesDto) {
    let page = dto.page || 1;
    let pageSize = dto.pageSize || 10;

    const query = this.classesRepository.createQueryBuilder('classes');

    if (dto.keyword)
      query.where(
        `MATCH(classes.name) AGAINST ('${dto.keyword}' IN BOOLEAN MODE)`,
      );

    if (dto.sortBy) {
      if (dto.sortBy.startsWith('-'))
        query.orderBy(`classes.${dto.sortBy.slice(1)}`, 'DESC');
      else {
        if (dto.sortBy.startsWith('+'))
          query.orderBy(`classes.${dto.sortBy.slice(1)}`, 'ASC');
        else query.orderBy(`classes.${dto.sortBy}`, 'ASC');
      }
    }

    const [data, totalRecords] = await query
      .leftJoinAndSelect('classes.user', 'user')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      data: data.map((e) => ({
        ...e,
        user: _.omit(e.user, ['password']),
        createdAt: moment(e.createdAt).format('YYYY-MM-DD'),
      })),
      pageInfo: {
        pageIndex: page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalRecords / pageSize),
        totalRecords,
      },
    };
  }

  async getClassDetail(dto: GetClassDetailDto) {
    const foundClass = await this.classesRepository.findOne({
      where: {
        id: dto.classId,
      },
      relations: ['user'],
    });
    if (!foundClass) throw new NotFoundException();
    return {
      ...foundClass,
      user: _.omit(foundClass.user, ['password']),
      createdAt: moment(foundClass.createdAt).format('YYYY-MM-DD'),
    };
  }
}
