import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Classes } from './entities/classes.entity';
import { StudentClass } from './entities/studentClass.entity';
import { TeacherClass } from './entities/teacherClass.entity';
import UserEntity from '@components/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/createClass.dto';
import { RolesEnum } from '@decorators/roles.decorator';
import JWT_CONST from '@common/constants/jwt.constant';
import { MailUtil } from '@utils/mail.util';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Classes) private classesRepository: Repository<Classes>,
    @InjectRepository(StudentClass)
    private studentClassRepository: Repository<StudentClass>,
    @InjectRepository(TeacherClass)
    private teacherClassRepository: Repository<TeacherClass>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly mailUtil: MailUtil,
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

  async joinByEmail(token: string) {
    const { classId, email, role } = await this.jwtService.verify(token, {
      secret: process.env.TEACHER_JOIN_CLASS_SECRET,
    });
    const isAccountExist = await this.userRepository.findOne({ email });
    if (!isAccountExist) {
      return;
    }
    switch (role) {
      case RolesEnum.TEACHER: {
        const isTeacherInClass = await this.teacherClassRepository.findOne({
          class_id: classId,
          user_id: isAccountExist.id,
        });
        if (isTeacherInClass) {
          return;
        }
        return this.teacherClassRepository.save({
          class_id: classId,
          user_id: isAccountExist.id,
        });
      }
      case RolesEnum.STUDENT: {
        const isStudentInClass = await this.studentClassRepository.findOne({
          class_id: classId,
          user_id: isAccountExist.id,
        });
        if (isStudentInClass) {
          return;
        }
        return this.studentClassRepository.save({
          class_id: classId,
          user_id: isAccountExist.id,
        });
      }
    }
  }

  async sendEmailInviteToClass({ userEmail, role, classId }) {
    const token = this.jwtService.sign(
      { classId, email: userEmail, role },
      {
        expiresIn: JWT_CONST.ACCESS_TOKEN_EXPIRED,
        secret: process.env.TEACHER_JOIN_CLASS_SECRET,
      },
    );
    const urlToSend = `join-by-email/${token}`;
    this.mailUtil.sendInvitationMail(urlToSend, userEmail);
    return;
  }

  async getClassDetail(id: string) {
    return this.classesRepository.findOne(id);
  }

  public async isTeacherOfClass(teacherId: string, classId: string) {
    const foundItems: any[] = await this.classesRepository.query(`
      SELECT * FROM [TeacherClass] WHERE user_id = '${teacherId}' AND class_id = '${classId}'
    `);

    if (foundItems.length > 0) return true;
    return false;
  }

  public async isStudentOfClass(studentId: string, classId: string) {
    const foundItems: any[] = await this.classesRepository.query(`
      SELECT * FROM [StudentClass] WHERE user_id = '${studentId}' AND class_id = '${classId}'
    `);

    if (foundItems.length > 0) return true;
    return false;
  }

  async getStudentsInClass(id: string) {
    return this.studentClassRepository.find({
      relations: ['user'],
      where: { class_id: id },
    });
  }

  async getTeachersInClass(id: string) {
    return this.teacherClassRepository.find({
      relations: ['user'],
      where: { class_id: id },
    });
  }

  public async changeStudentId(classId, userId, studentId) {
    const data = await this.studentClassRepository.findOne({
      where: { class_id: classId, student_id: studentId },
    });
    if (data) return null;
    const res = await this.studentClassRepository.update(
      {
        class_id: classId,
        user_id: userId,
      },
      {
        student_id: studentId,
      },
    );
    if (res.affected == 1) return studentId;
  }
  public async fetchStudentId(classId, userId) {
    const data = await this.studentClassRepository.findOne({
      where: { class_id: classId, user_id: userId },
    });
    if (data) return data.student_id;
    return null;
  }
}
