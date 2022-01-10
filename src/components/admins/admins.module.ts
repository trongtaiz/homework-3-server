import UserEntity from '@components/users/entities/users.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import AdminsController from './admins.controller';
import AdminsService from './admins.service';
import AdminsEntity from './entities/admins.entity';
import { Classes as ClassesEntity } from '@components/classes/entities/classes.entity';
import AdminAccessStrategy from './strategies/admin-access.strategy';
import { ClassesModule } from '@components/classes/classes.module';
import { TeacherClass } from '@components/classes/entities/teacherClass.entity';
import { StudentClass } from '@components/classes/entities/studentClass.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminsEntity,
      UserEntity,
      ClassesEntity,
      StudentClass,
      TeacherClass,
    ]),
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [AdminsController],
  providers: [AdminsService, AdminAccessStrategy],
  exports: [AdminsService],
})
export default class AdminsModule {}
