import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Classes } from './entities/classes.entity';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/createClass.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Classes) private classesRepository: Repository<Classes>,
  ) {}

  async createClass(createClassInput: CreateClassDto) {
    const newClass = this.classesRepository.create({ ...createClassInput });

    return this.classesRepository.save(newClass);
  }

  async getAllClasses() {
    return this.classesRepository.find();
  }
}
