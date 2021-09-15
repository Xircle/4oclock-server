import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import 'moment/locale/ko';

@Injectable()
export class PlaceUtilService {
  /**
   * Returns boolean whether a given event date is closed or not.
   * @param eventDate
   * @returns
   */
  isClosed(eventDate: Date): boolean {
    const current_date = moment();
    const event_date = moment(eventDate);
    if (event_date.diff(current_date, 'hours') < -1) return true;
    else return false;
  }

  /**
   * Returns deadline caption, according to event's date
   * @param eventDate
   * @returns
   */
  getDeadlineCaption(eventDate: Date): string {
    const current_date = moment();
    const event_date = moment(eventDate);
    if (event_date.diff(current_date, 'hours') < -1) {
      return '마감';
    } else if (event_date.diff(current_date, 'hours') < 23) {
      return '오늘 마감';
    } else if (event_date.diff(current_date, 'hours') < 47) {
      return 'D-1';
    } else {
      return undefined;
    }
  }

  /**
   * Returns event's date with custom caption.
   * @param eventDate
   * @example "오늘", "내일", "이번주 목요일"
   */
  getEventDateCaption(eventDate: Date): string {
    let event_date_caption: string[] = [];

    if (moment(eventDate).isSame(moment(), 'day')) {
      event_date_caption.push('오늘');
    } else {
      if (moment(eventDate).isAfter(moment(), 'day')) {
        // 적어도 내일 이상
        const this_monday = moment().startOf('isoWeek');
        const this_sunday = moment().endOf('isoWeek');
        if (
          moment(eventDate).isBetween(this_monday, this_sunday, undefined, '[]')
        ) {
          event_date_caption.push(
            '이번주',
            moment(eventDate).format('dddd').replace('요일', ''),
          );
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
            event_date_caption.push(
              '다음주',
              moment(eventDate).format('dddd').replace('요일', ''),
            );
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
