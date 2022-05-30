import { CoreOutput } from '@common/common.interface';
import { Injectable } from '@nestjs/common';
import {
  MessagingOptions,
  MessagingPayload,
} from 'firebase-admin/lib/messaging/messaging-api';
import * as admin from 'firebase-admin';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class NotificationService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  async sendNotifications(
    registrationTokenOrTokens: string | string[],
    payload: MessagingPayload,
    options?: MessagingOptions,
    scheduledTime?: string,
  ): Promise<CoreOutput> {
    try {
      if (!registrationTokenOrTokens) {
        return { ok: false, error: 'No Firebase Token' };
      }
      if (scheduledTime) {
        const job = new CronJob(scheduledTime, async () => {
          await admin
            .messaging()
            .sendToDevice(registrationTokenOrTokens, payload, options);
        });

        this.schedulerRegistry.addCronJob('notification', job);
        job.start();
      } else {
        await admin
          .messaging()
          .sendToDevice(registrationTokenOrTokens, payload, options);
      }

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
