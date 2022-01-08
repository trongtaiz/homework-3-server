import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './entities/notifications.entity';

import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { UpdateNotificationDto } from './dto/updateNotification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private notificationsRepository: Repository<Notifications>,
  ) {}

  async createNotification(dto: CreateNotificationDto) {
    const tempNotification = this.notificationsRepository.create(dto);
    const newNotification = await this.notificationsRepository.save(
      tempNotification,
    );
    return newNotification;
  }

  async updateNotification(dto: UpdateNotificationDto) {
    await this.notificationsRepository.update({ id: dto.id }, dto);
    return this.notificationsRepository.findOne(dto.id);
  }
  async getNotificationsInClass(class_id: string, receiver_id: string) {
    return this.notificationsRepository.find({
      order: {
        createdAt: 'DESC',
      },
      where: { classId: class_id, receiverId: receiver_id },
    });
  }
}
