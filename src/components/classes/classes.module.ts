import { Classes } from './entities/classes.entity';
import { StudentClass } from './entities/studentClass.entity';
import { TeacherClass } from './entities/teacherClass.entity';
import UserEntity from '@components/users/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from '@components/classes/classes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '@utils/mail.util';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([Classes, StudentClass, TeacherClass, UserEntity]),
    MailModule,
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
