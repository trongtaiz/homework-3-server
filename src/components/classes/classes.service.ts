import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import UploadedStudentEntity from './entities/uploaded-students.entity';
import _ from 'lodash';
import GetPointsOfStudentDto from './dto/get-points-of-student.dto';
import AssignmentOfStudentEntity from '@components/assignments/entities/assignment-student.entity';

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
    @InjectRepository(UploadedStudentEntity)
    private uploadedStudentRepository: Repository<UploadedStudentEntity>,
    // private readonly assignmentsService: AssignmentsService,
    @InjectRepository(AssignmentOfStudentEntity)
    private assignmentOfStudentRepository: Repository<AssignmentOfStudentEntity>,
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
    return newClass;
  }

  async getAllClasses(id) {
    const teacherClassArray: any[] = await this.classesRepository.query(`
      SELECT class_id FROM TeacherClass WHERE user_id = '${id}'`);

    const studentClassArray: any[] = await this.classesRepository.query(`
      SELECT class_id FROM StudentClass WHERE user_id = '${id}'`);

    let allClassId = teacherClassArray
      .map((eachValue) => eachValue.class_id)
      .concat(studentClassArray.map((eachValue) => eachValue.class_id));

    allClassId = allClassId.filter((item, index) => {
      return allClassId.indexOf(item) == index;
    });
    if (!allClassId.length) {
      return;
    }
    const result = await this.classesRepository
      .createQueryBuilder()
      .select(['*'])
      .where('id IN (:...allClassId)', {
        allClassId,
      })
      .execute();
    return result;
  }

  async getInviteId(classId: string) {
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
      SELECT * FROM TeacherClass WHERE user_id = '${teacherId}' AND class_id = ${parseInt(
      classId,
    )}
    `);

    if (foundItems.length > 0) return true;
    return false;
  }

  public async isStudentOfClass(studentId: string, classId: string) {
    const foundItems: any[] = await this.classesRepository.query(`
      SELECT * FROM StudentClass WHERE user_id = '${studentId}' AND class_id = ${parseInt(
      classId,
    )}
    `);

    if (foundItems.length > 0) return true;
    return false;
  }

  public async isUploadedStudentOfClass(studentId: string, classId: string) {
    const foundItems: any[] = await this.classesRepository.query(`
      SELECT * FROM UploadedStudents WHERE studentId = '${studentId}' AND classId = ${parseInt(
      classId,
    )}
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

  public async changeStudentId(userId: string, studentId: string) {
    const data = await this.userRepository.findOne({
      id: userId,
      studentId,
    });

    if (data) throw new BadRequestException('This studentId is already taken');

    const res = await this.userRepository.update(
      {
        id: userId,
      },
      {
        studentId,
      },
    );
    if (res.affected == 1) return studentId;
  }
  public async fetchStudentId(userId: string) {
    const data = await this.userRepository.findOne({ id: userId });

    if (!data) throw new NotFoundException();

    return data.studentId;
  }

  async getRole(classId, userId) {
    const student = await this.studentClassRepository.findOne({
      where: { class_id: classId, user_id: userId },
    });
    console.log('student', student);
    if (student) return 'STUDENT';
    const teacher = await this.teacherClassRepository.findOne({
      where: { class_id: classId, user_id: userId },
    });
    if (teacher) return 'TEACHER';
    return null;
  }

  async upsertAllStudentsOfClass(
    classId: string,
    students: { studentId: string; fullName: string }[],
  ) {
    return this.uploadedStudentRepository.save(
      this.uploadedStudentRepository.create(
        students.map((e) => ({
          ...e,
          classId,
        })),
      ),
    );
  }

  async getAllAssignmentPoints(classId: string) {
    const data = await this.uploadedStudentRepository
      .createQueryBuilder('std')
      .leftJoinAndSelect('std.studentAccount', 'studentAccount')
      // .leftJoinAndSelect('studentAccount.user', 'user')
      .leftJoinAndSelect('std.assignments', 'assignments')
      .leftJoinAndSelect('assignments.detail', 'detail')
      .where(`std.classId = '${classId}'`)
      .getMany();

    // console.log(data);

    data.forEach((e) => {
      if (e.studentAccount)
        e.studentAccount = _.pick(e.studentAccount, [
          'id',
          'email',
          'name',
        ]) as any;
    });
    return data;
  }

  async getAllPointsOfStudentOfClass(dto: GetPointsOfStudentDto) {
    const data = await this.assignmentOfStudentRepository.find({
      where: {
        classId: dto.classId,
        studentId: dto.studentId,
      },
      relations: ['student', 'detail', 'review'],
    });

    data.forEach((e) => {
      if (!e.detail?.isFinalized) e.achievedPoint = -1;
    });

    return data;
  }
}
