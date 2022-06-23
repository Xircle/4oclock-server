import { User } from '@user/entities/user.entity';
import * as moment from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import 'moment/locale/ko';
import { Review } from '@review/entities/review.entity';
import { Reservation } from '@reservation/entities/reservation.entity';
import { PlaceDetail } from './place-detail.entity';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export enum DeadlineIndicator {
  'Done' = '마감',
  'Today' = '오늘 마감',
  'D-1' = 'D-1 마감',
  'D-2' = 'D-2 마감',
  'D-3' = 'D-3 마감',
}

export enum PlaceType {
  'All' = 'All',
  'Event' = 'Event',
  'Lightning' = 'Lightning',
  'Regular-meeting' = 'Regular-meeting',
}
@Entity({ name: 'places' })
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  kakaoPlaceId?: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  coverImage: string;

  @Column('varchar', { array: true, nullable: true, length: 511 })
  subImages?: string[];

  @Column('varchar', { array: true, nullable: true })
  qAndA?: string[];

  @Column('varchar', { nullable: true, length: 255 })
  team?: string;

  @Column({ length: 255, nullable: true })
  oneLineIntroText?: string;

  @Column({ length: 255, default: '전체' })
  location?: string;

  @Column({ length: 255, default: '모든' })
  recommendation?: string;

  @Column('timestamptz')
  startDateAt: Date;

  @Column({ default: false })
  isClosed: boolean;

  @Column({ type: 'enum', enum: PlaceType, default: PlaceType.All })
  @IsEnum(PlaceType)
  placeType: PlaceType;

  @Column({ default: 0 })
  views: number;

  @OneToMany((type) => Review, (review) => review.place)
  reviews: Review[];

  @OneToOne((type) => PlaceDetail, (placeDetail) => placeDetail.place, {
    cascade: true,
    eager: true,
  })
  placeDetail: PlaceDetail;

  @OneToMany((type) => Reservation, (reservation) => reservation.place)
  reservations: Reservation[];

  @ManyToOne((type) => User, (user) => user.createdPlaces)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column('uuid')
  creator_id: string;

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;

  @Expose()
  isToday(): boolean {
    if (moment(this.startDateAt).isSame(moment(), 'day')) {
      return true;
    }
    return false;
  }

  @Expose()
  isAfterToday(): boolean {
    if (moment(this.startDateAt).isAfter(moment(), 'day')) {
      return true;
    }
    return false;
  }

  @Expose()
  isThisWeek(): boolean {
    const thisMonday = moment().startOf('isoWeek');
    const thisSunday = moment().endOf('isoWeek');
    if (
      moment(this.startDateAt).isBetween(
        thisMonday,
        thisSunday,
        undefined,
        '[]',
      )
    ) {
      return true;
    }
    return false;
  }

  @Expose()
  isNextWeek(): boolean {
    const thisMonday = moment().startOf('isoWeek');
    const thisSunday = moment().startOf('isoWeek');
    const nextMonday = moment(thisMonday).add(7, 'days');
    const nextSunday = moment(thisSunday).add(7, 'days');
    if (
      moment(this.startDateAt).isBetween(
        nextMonday,
        nextSunday,
        undefined,
        '[]',
      )
    ) {
      return true;
    }
    return false;
  }

  @Expose()
  getStartHours(): number {
    return this.startDateAt.getHours();
  }

  @Expose()
  getStartMinute(): number {
    return this.startDateAt.getMinutes();
  }

  @Expose()
  getStartDateCaption() {
    const current_date = moment().format('YYYY-MM-DD');
    if (moment(this.startDateAt).diff(current_date, 'days') === 1) {
      return '내일';
    } else if (moment(this.startDateAt).diff(current_date, 'days') === 2) {
      return '모레';
    } else {
      return `이번주 ${moment(this.startDateAt).format('dddd')}`;
    }
  }

  /**
   * Returns event's date with custom caption.
   * @example 마감, 오늘, 내일, 모레 이번주 *요일, 다음주 *요일, 10월 31일
   */
  @Expose()
  getStartDateFromNow() {
    const noonDefined = this.getStartHours() > 11 ? '오후 ' : '오전 ';
    const hour =
      this.getStartHours() > 12
        ? this.getStartHours() - 12
        : this.getStartHours();
    const startHours = `${noonDefined} ${hour}`;
    const startMinute =
      this.getStartMinute() > 0 ? `${this.getStartMinute()} 분` : '';
    const isToday = this.isToday();
    if (isToday) {
      return `오늘 ${startHours} 시 ${startMinute}`;
    }

    const isAfterToday = this.isAfterToday();
    if (!isAfterToday) {
      return '마감';
    }

    const isThisWeek = this.isThisWeek();
    if (isThisWeek) {
      const dateCaption = this.getStartDateCaption();
      return `${dateCaption} ${startHours} 시 ${startMinute}`;
    }

    const isNextWeek = this.isNextWeek();
    if (isNextWeek) {
      return `다음주 ${moment(this.startDateAt).format(
        'dddd',
      )} ${startHours} 시 ${startMinute}`;
    }

    return `${moment(this.startDateAt).format(
      'M월 DD일',
    )} ${startHours} 시 ${startMinute}`;
  }

  /**
   * Returns deadline caption, according to event's date
   */
  @Expose()
  getDeadlineCaption(today: Date): string {
    const current_date = moment().format('YYYY-MM-DD');
    const start_date = moment(this.startDateAt);
    if (this.startDateAt < today) {
      return DeadlineIndicator.Done;
    }
    if (start_date.diff(current_date, 'days') === 0) {
      const deadlineDate = start_date.subtract(1, 'hours');
      const duration = moment.duration(deadlineDate.diff(moment()));
      if (duration.asSeconds() <= 0) {
        return DeadlineIndicator.Done; // 3 시간 전에 마감
      }
      return DeadlineIndicator.Today; // 오늘 마감
    } else if (start_date.diff(current_date, 'days') === 1) {
      return DeadlineIndicator.Today; // 오늘 마감
    } else if (start_date.diff(current_date, 'days') === 2) {
      return DeadlineIndicator['D-1'];
    } else if (start_date.diff(current_date, 'days') === 3) {
      return DeadlineIndicator['D-2'];
    } else if (start_date.diff(current_date, 'days') === 4) {
      return DeadlineIndicator['D-3'];
    } else {
      return undefined;
    }
  }
}
