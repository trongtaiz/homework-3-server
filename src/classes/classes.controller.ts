import { Controller, Get, Post, Body } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/createClass.dto';

@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Post('/')
  createClass(@Body() createClassDto: CreateClassDto) {
    console.log(
      '🚀 ~ file: classes.controller.ts ~ line 11 ~ ClassesController ~ createClass ~ createClassDto',
      createClassDto,
    );

    return this.classesService.createClass(createClassDto);
  }

  @Get('/all')
  getAllClasses() {
    return this.classesService.getAllClasses();
  }
}
