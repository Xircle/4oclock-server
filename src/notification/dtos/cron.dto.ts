import { MessagingOptions } from 'firebase-admin/lib/messaging/messaging-api';
export class CronInput {
  name: string;
  time: string;
}

export class INotificationOptions {
  cronInput?: CronInput;
  fcmOptions?: MessagingOptions;
}
