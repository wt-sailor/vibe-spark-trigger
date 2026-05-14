import { IsString, IsOptional, IsBoolean, IsArray, IsObject } from 'class-validator';

/**
 * Data Transfer Object for sending notifications.
 * This defines the shape of the request body and can be used for validation.
 */
export class SendNotificationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  body?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  clickAction?: string;

  @IsArray()
  @IsOptional()
  externalUsers?: string[];

  @IsBoolean()
  @IsOptional()
  silent?: boolean;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}
