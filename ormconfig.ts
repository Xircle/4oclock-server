import { config } from 'dotenv';
config();
import { SocialAccount } from 'src/user/entities/social-account.entity';
import { Message } from './src/message/entities/message.entity';
import { PlaceDetail } from './src/place/entities/place-detail.entity';
import { UserProfile } from './src/user/entities/user-profile.entity';
import { User } from './src/user/entities/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Place } from 'src/place/entities/place.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Room } from 'src/room/entities/room.entity';

export const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    User,
    UserProfile,
    SocialAccount,
    Place,
    PlaceDetail,
    Reservation,
    Room,
    Message,
  ],
  ...(process.env.NODE_ENV === 'prod' && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
  synchronize: process.env.NODE_ENV === 'prod' && true,
  logging: true,
};
