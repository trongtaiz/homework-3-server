import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Classes } from './entities/classes.entity';
import { StudentClass } from './entities/studentClass.entity';
import { TeacherClass } from './entities/teacherClass.entity';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/createClass.dto';
import { MailUtil } from '@utils/mail.util';
import { RolesEnum } from '@decorators/roles.decorator';
import JWT_CONST from '@common/constants/jwt.constant';

const mailUtil = new MailUtil();
@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Classes) private classesRepository: Repository<Classes>,
    @InjectRepository(StudentClass)
    private studentClassRepository: Repository<StudentClass>,
    @InjectRepository(TeacherClass)
    private teacherClassRepository: Repository<TeacherClass>,
    private readonly jwtService: JwtService,
  ) {}

  async createClass(userId, createClassInput: CreateClassDto) {
    const tempClass = this.classesRepository.create({
      ...createClassInput,
      create_by: userId,
    });

    const newClass = await this.classesRepository.save(tempClass);

    this.teacherClassRepository.save({
      class_id: newClass.id,
      user_id: userId,
    });
  }

  async getAllClasses() {
    return this.classesRepository.find();
  }

  async getInviteId(classId: number) {
    return this.classesRepository.findOne(
      { id: classId },
      { select: ['invite_id'] },
    );
  }

  async joinClass({ studentId, classId, inviteId }) {
    const isStudentInClass = await this.studentClassRepository.findOne({
      class_id: classId,
      user_id: studentId,
    });

    if (isStudentInClass) {
      return;
    }

    const inviteIdOfClass = await this.getInviteId(classId);
    if (inviteIdOfClass?.invite_id !== inviteId) {
      return;
    }

    return this.studentClassRepository.save({
      class_id: classId,
      user_id: studentId,
    });
  }

  async assignTeacher(token: string, teacherId: number) {
    const { classId } = await this.jwtService.verify(token, {
      secret: process.env.TEACHER_JOIN_CLASS_SECRET,
    });
    const isTeacherInClass = await this.teacherClassRepository.findOne({
      class_id: classId,
      user_id: teacherId,
    });

    if (isTeacherInClass) {
      return;
    }

    return this.teacherClassRepository.save({
      class_id: classId,
      user_id: teacherId,
    });
  }

  async sendEmailInviteTeacher(userId, { userEmail, role, classId }) {
    const isClassExiest = await this.classesRepository.findOne(
      { id: classId },
      { select: ['create_by'] },
    );
    if (!isClassExiest || isClassExiest.create_by !== userId) {
      return;
    }
    if (role === RolesEnum.STUDENT) {
      const inviteIdOfClass = await this.getInviteId(classId);
      console.log(inviteIdOfClass, classId);
      const urlToSend = `join-class/?classId=${classId}&inviteId=${inviteIdOfClass?.invite_id}`;
      mailUtil.sendInvitationMail(urlToSend, userEmail);
      return;
    }

    if (role === RolesEnum.TEACHER) {
      const token = this.jwtService.sign(
        { classId },
        {
          expiresIn: JWT_CONST.ACCESS_TOKEN_EXPIRED,
          secret: process.env.TEACHER_JOIN_CLASS_SECRET,
        },
      );
      const urlToSend = `teacher-join/${token}`;
      mailUtil.sendInvitationMail(urlToSend, userEmail);
      return;
    }
  }
  async getClassDetail(id: string) {
    return this.classesRepository.findOne(id);
  }
}
