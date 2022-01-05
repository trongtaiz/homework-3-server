import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from '@components/notifications/entities/notifications.entity';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([Notifications])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
