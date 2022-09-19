import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyMiddleware } from './middleware';
import 'env';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as Amplitude from '@amplitude/node';
import { init } from '@amplitude/analytics-node';
import { track } from '@amplitude/analytics-node';

export const amplitudeClient = Amplitude.init(
  '013561f63e98681c59bb1cabc0548e0d',
);

init('013561f63e98681c59bb1cabc0548e0d');

// amplitudeClient.logEvent({
//   event_type: 'Node.js Event',
//   user_id: 'datamonster@gmail.com',
//   location_lat: 37.77,
//   location_lng: -122.39,
//   ip: '127.0.0.1',
//   event_properties: {
//     keyString: 'valueString',
//     keyInt: 11,
//     keyBool: true,
//   },
// });

async function bootstrap() {
  const momentConfig = require('moment');
  require('moment-timezone');
  momentConfig.tz.setDefault('Asia/Seoul');

  const firebaseConfig: ServiceAccount = {
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    projectId: process.env.FIREBASE_PROJECT_ID,
  };

  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL:
      'aa1x1d93gqdhvlg.cxxbypwc85ck.ap-northeast-2.rds.amazonaws.com',
  });
  const app = await NestFactory.create(AppModule);
  applyMiddleware(app);
  await app.listen(process.env.PORT || 3080, () => {
    process.send?.('ready');
  });
  process.on('SIGINT', () => {
    console.log('process exited');
    process.exit(0);
  });
}

bootstrap();
