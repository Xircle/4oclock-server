import { CoreOutput } from '@common/common.interface';
import { Injectable } from '@nestjs/common';
import { MessagingPayload } from 'firebase-admin/lib/messaging/messaging-api';
import * as admin from 'firebase-admin';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { INotificationOptions } from './dtos/cron.dto';

@Injectable()
export class NotificationService {
  constructor(
    private schedulerRegistry: SchedulerRegistry, // private readonly userRepository: UserRepository, // private placeRepository: PlaceRepository,
  ) {}

  async cancelNotifications(name: string): Promise<void> {
    this.schedulerRegistry.deleteCronJob(name);
  }

  async sendNotifications(
    registrationTokenOrTokens: string | string[],
    payload: MessagingPayload,
    options?: INotificationOptions,
  ): Promise<CoreOutput> {
    try {
      if (!registrationTokenOrTokens) {
        return { ok: false, error: 'No Firebase Token' };
      }
      if (options?.cronInput) {
        const job = new CronJob(options.cronInput.time, () => {
          admin.messaging().sendToDevice(registrationTokenOrTokens, payload, {
            // Required for background/quit data-only messages on iOS
            contentAvailable: true,
            // Required for background/quit data-only messages on Android
            priority: 'high',
          });
        });

        this.schedulerRegistry.addCronJob(options.cronInput.name, job);
        job.start();
      } else {
        await admin
          .messaging()
          .sendToDevice(registrationTokenOrTokens, payload, {
            // Required for background/quit data-only messages on iOS
            contentAvailable: true,
            // Required for background/quit data-only messages on Android
            priority: 'high',
          });
      }

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
