import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './entities/users.entity';
import UsersService from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export default class UsersModule {}
