import * as moment from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import 'moment/locale/ko';
import { Review } from '@review/entities/review.entity';
import { Reservation } from '@reservation/entities/reservation.entity';
import { PlaceDetail } from './place-detail.entity';

export enum DeadlineIndicator {
  'Done' = '마감',
  'Today' = '오늘 마감',
  'D-1' = 'D-1 마감',
  'D-2' = 'D-2 마감',
  'D-3' = 'D-3 마감',
}

@Entity({ name: 'places' })
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  coverImage: string;

  @Column('varchar', { array: true, nullable: true, length: 511 })
  subImages: string[];

  @Column({ length: 255, nullable: true })
  oneLineIntroText?: string;

  @Index()
  @Column({ length: 255, default: '전체' })
  location?: string;

  @Column({ length: 255, default: '모든' })
  recommendation?: string;

  @Column('timestamptz')
  startDateAt: Date;

  @Column({ default: false })
  isClosed: boolean;

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

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;

  isToday(): boolean {
    if (moment(this.startDateAt).isSame(moment(), 'day')) {
      return true;
    }
    return false;
  }

  isAfterToday(): boolean {
    if (moment(this.startDateAt).isAfter(moment(), 'day')) {
      return true;
    }
    return false;
  }

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

  getStartHours(): number {
    return this.startDateAt.getHours();
  }

  getStartDateCaption() {
    const current_date = moment().format('YYYY-MM-DD');
    if (moment(this.startDateAt).diff(current_date, 'days') === 1) {
      return '내일';
    } else if (moment(this.startDateAt).diff(current_date, 'days') === 2) {
      return '모래';
    } else {
      return `이번주 ${moment(this.startDateAt).format('dddd')}`;
    }
  }

  /**
   * Returns event's date with custom caption.
   * @example 마감, 오늘, 내일, 모래 이번주 *요일, 다음주 *요일, 10월 31일
   */
  getStartDateFromNow() {
    const isToday = this.isToday();
    if (isToday) {
      const startHours = this.getStartHours();
      return `오늘 ${startHours}`;
    }

    const isAfterToday = this.isAfterToday();
    if (!isAfterToday) {
      return '마감';
    }

    const isThisWeek = this.isThisWeek();
    if (isThisWeek) {
      const dateCaption = this.getStartDateCaption();
      const hours = this.getStartHours();
      return `${dateCaption} ${hours}`;
    }

    const isNextWeek = this.isNextWeek();
    if (isNextWeek) {
      return `다음주 ${moment(this.startDateAt).format('dddd')}`;
    }

    return `${moment(this.startDateAt).format('M월 DD일')}`;
  }

  /**
   * Returns deadline caption, according to event's date
   */
  getDeadlineCaption(): string {
    const current_date = moment().format('YYYY-MM-DD');
    const start_date = moment(this.startDateAt);

    if (start_date.diff(current_date, 'days') === 0) {
      const deadlineDate = start_date.subtract(3, 'hours');
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
