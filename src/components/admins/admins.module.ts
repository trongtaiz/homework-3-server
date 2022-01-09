import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import AdminsController from './admins.controller';
import AdminsService from './admins.service';
import AdminsEntity from './entities/admins.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminsEntity]),
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export default class AdminsModule {}
