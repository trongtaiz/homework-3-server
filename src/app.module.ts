import { Module } from '@nestjs/common';
import { ClassesModule } from './classes/classes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classes } from './classes/classes.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://trongtaiz:sZZ74PjiDjbS78f7@googlefakeclassroom.727fp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
      synchronize: true,
      useUnifiedTopology: true,
      entities: [Classes],
    }),
    ClassesModule,
  ],
})
export class AppModule {}
