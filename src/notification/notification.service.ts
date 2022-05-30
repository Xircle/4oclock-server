import { CoreOutput } from '@common/common.interface';
import { Injectable } from '@nestjs/common';
import {
  MessagingOptions,
  MessagingPayload,
} from 'firebase-admin/lib/messaging/messaging-api';
import * as admin from 'firebase-admin';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CronInput } from './dtos/cron.dto';

@Injectable()
export class NotificationService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  async sendNotifications(
    registrationTokenOrTokens: string | string[],
    payload: MessagingPayload,
    options?: MessagingOptions,
    cronInput?: CronInput,
  ): Promise<CoreOutput> {
    try {
      if (!registrationTokenOrTokens) {
        return { ok: false, error: 'No Firebase Token' };
      }
      if (cronInput) {
        const job = new CronJob(cronInput.time, async () => {
          await admin
            .messaging()
            .sendToDevice(registrationTokenOrTokens, payload, options);
        });

        this.schedulerRegistry.addCronJob(cronInput.name, job);
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
