import { Controller, Post, Body, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('api')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Endpoint to send a notification.
   * Equivalent to POST /api/send-notification in the Express version.
   */
  @Post('send-notification')
  @HttpCode(HttpStatus.OK)
  async sendNotification(@Body() dto: SendNotificationDto) {
    // Validation: if not silent, title and body are required
    if (!dto.silent && (!dto.title || !dto.body)) {
      throw new BadRequestException({
        success: false,
        error: 'title and body are required',
      });
    }

    const result = await this.notificationsService.sendNotification(dto);
    
    return {
      success: true,
      data: result,
    };
  }
}
