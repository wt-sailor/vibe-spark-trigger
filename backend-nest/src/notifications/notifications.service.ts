import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initServerClient } from 'vibe-message';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private server: any;

  constructor(private configService: ConfigService) {
    this.initializeClient();
  }

  /**
   * Initializes the Vibe Message server client using configuration from environment variables.
   */
  private initializeClient() {
    const appId = this.configService.get<string>('VIBE_MESSAGE_APP_ID');
    const secretKey = this.configService.get<string>('VIBE_MESSAGE_SECRET_KEY');
    const rawBaseUrl = this.configService.get<string>('VIBE_MESSAGE_URL');
    const baseUrl = rawBaseUrl ? `${rawBaseUrl}/api` : undefined;

    if (!appId || !secretKey || !baseUrl) {
      this.logger.error('Missing Vibe Message configuration in environment variables');
      return;
    }

    this.server = initServerClient({
      baseUrl,
      appId,
      secretKey,
    });
    
    this.logger.log('Vibe Message client initialized successfully');
  }

  /**
   * Sends a notification using the Vibe Message client.
   * @param dto - The notification data transfer object.
   * @returns The result from the Vibe Message API.
   */
  async sendNotification(dto: SendNotificationDto) {
    const { title, body, icon, clickAction, externalUsers, silent, data } = dto;

    // Logic equivalent to the original Express backend
    if (!this.server) {
      this.logger.error('Vibe Message client not initialized');
      throw new InternalServerErrorException('Server not configured for notifications');
    }

    try {
      // Build notification options
      const notificationOptions = {
        notificationData: {
          title: title || (silent ? 'Silent Update' : ''),
          body: body || '',
          icon: icon || '/placeholder.svg',
          click_action: clickAction || '/',
          silent: !!silent,
        },
        data: data || {},
        ...(externalUsers && Array.isArray(externalUsers) && externalUsers.length > 0
          ? { externalUsers }
          : {}),
      };

      // Send notification via Vibe Message SDK
      const result = await this.server.notification(notificationOptions);
      return result;
    } catch (error) {
      this.logger.error(`Notification error: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to send notification',
      );
    }
  }
}
