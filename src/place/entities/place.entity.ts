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
import * as moment from 'moment';
import 'moment/locale/ko';
import { PlaceDetail } from './place-detail.entity';
import { Review } from '@review/entities/review.entity';
import { Reservation } from '@reservation/entities/reservation.entity';

@Entity({ name: 'places' })
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  coverImage: string;

  @Column({ length: 255, default: '' })
  oneLineIntroText: string;

  @Index()
  @Column({ length: 255 })
  location: string;

  @Column({ length: 255 })
  recommendation: string;

  @Index()
  @Column({
    type: 'date',
    nullable: true,
  })
  startDateAt: Date;

  @Column({ default: 18 })
  startTime: number;

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

  /**
   * Returns deadline caption, according to event's date
   */
  getDeadlineCaption(): string {
    const current_date = moment().format('YYYY-MM-DD');
    const event_date = moment(this.startDateAt);

    if (event_date.diff(current_date, 'days') === 0) {
      return '마감';
    } else if (event_date.diff(current_date, 'days') === 1) {
      return '오늘 마감';
    } else if (event_date.diff(current_date, 'days') === 2) {
      return 'D-1';
    } else if (event_date.diff(current_date, 'days') === 3) {
      return 'D-2';
    } else if (event_date.diff(current_date, 'days') === 4) {
      return 'D-3';
    } else {
      return undefined;
    }
  }

  /**
   * Returns event's date with custom caption.
   * @example 마감, 오늘, 내일, 모래 이번주 *요일, 다음주 *요일, 10월 31일
   */
  getStartDateFromNow() {
    const eventDate = this.startDateAt;
    let event_date_caption: string[] = [];
    if (moment(eventDate).isSame(moment(), 'day')) {
      event_date_caption.push('오늘');
    } else {
      if (moment(eventDate).isAfter(moment(), 'day')) {
        // 적어도 내일 이상
        const this_monday = moment().startOf('isoWeek');
        const this_sunday = moment().endOf('isoWeek');
        const current_date = moment().format('YYYY-MM-DD');
        const event_date = moment(eventDate);
        if (
          moment(eventDate).isBetween(this_monday, this_sunday, undefined, '[]')
        ) {
          // console.log(event_date, current_date);
          if (event_date.diff(current_date, 'days') === 1) {
            event_date_caption.push('내일');
          } else {
            event_date_caption.push('이번주', moment(eventDate).format('dddd'));
          }
        } else {
          // 다음주 이상
          const next_monday = moment(this_monday).add(7, 'days');
          const next_sunday = moment(this_sunday).add(7, 'days');
          if (
            moment(eventDate).isBetween(
              next_monday,
              next_sunday,
              undefined,
              '[]',
            )
          ) {
            event_date_caption.push('다음주', moment(eventDate).format('dddd'));
          } else {
            event_date_caption.push(moment(eventDate).format('M월DD일'));
          }
        }
      } else {
        event_date_caption.push('마감');
      }
    }

    return event_date_caption.join(' ');
  }
}
