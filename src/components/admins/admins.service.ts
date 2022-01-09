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
import GetAdminDetailDto from './dto/get-admin-detal.dto';
import moment from 'moment';
@Injectable()
export default class AdminsService implements OnModuleInit {
  constructor(
    @InjectRepository(AdminsEntity)
    private readonly adminsRepository: Repository<AdminsEntity>,
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
    console.log(dto);
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
}
