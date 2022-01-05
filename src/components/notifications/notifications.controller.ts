import JwtAccessGuard from '@guards/jwt-access.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UpdateNotificationDto } from './dto/updateNotification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@UseInterceptors(WrapResponseInterceptor)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @UseGuards(JwtAccessGuard)
  @Post('/')
  createNotification(@Body() data) {
    console.log('receivers: ', data.receivers);
    console.log('dto: ', data.dto);
    for (const receiver of data.receivers) {
      this.notificationsService.createNotification({
        ...data.dto,
        receiverId: receiver,
      });
    }
  }

  @ApiBody({ type: UpdateNotificationDto })
  @UseInterceptors(WrapResponseInterceptor)
  @UseGuards(JwtAccessGuard)
  @Patch()
  async updateNotification(@Body() dto: UpdateNotificationDto) {
    return this.notificationsService.updateNotification(dto);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/all-in-class')
  getAllNotifications(@Query() query) {
    const { classId, receiverId } = query;
    return this.notificationsService.getNotificationsInClass(
      classId,
      receiverId,
    );
  }
}
