import {
  BadRequestException,
  Injectable,
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
}
