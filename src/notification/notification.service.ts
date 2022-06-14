import { CoreOutput } from '@common/common.interface';
import { Injectable } from '@nestjs/common';
import { MessagingPayload } from 'firebase-admin/lib/messaging/messaging-api';
import * as admin from 'firebase-admin';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { INotificationOptions } from './dtos/cron.dto';

@Injectable()
export class NotificationService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

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
          admin
            .messaging()
            .sendToDevice(
              registrationTokenOrTokens,
              payload,
              options?.fcmOptions,
            );
        });

        this.schedulerRegistry.addCronJob(options.cronInput.name, job);
        job.start();
      } else {
        await admin
          .messaging()
          .sendToDevice(
            registrationTokenOrTokens,
            payload,
            options?.fcmOptions,
          );
      }

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}