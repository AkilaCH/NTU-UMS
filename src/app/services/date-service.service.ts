import {Injectable} from '@angular/core';
import {DateRange} from '../widgets/date-range-picker/public-api';
import { DatePipe } from '@angular/common';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class DateServiceService {

  constructor(private datePipe: DatePipe) {
  }

  private setDate(date: number, month: number, year: number) {
    const dateObject = new Date();
    dateObject.setDate(date);
    dateObject.setMonth(month);
    dateObject.setFullYear(year);
    return dateObject;
  }

  private setDateRange(month: number, date: number, year: number) {
    const dateRange = new DateRange();
    dateRange.start = new Date();
    dateRange.end = new Date();
    dateRange.start.setDate(date);
    dateRange.start.setMonth(month);
    dateRange.start.setFullYear(year);
    return dateRange;
  }

  getRoundedHalfHour = (minutes, d=new Date()) => {

    let ms = 1000 * 60 * minutes;
    let roundedDate;
    roundedDate =  new Date(Math.round(d.getTime() / ms) * ms);

    if(roundedDate>=d){
      roundedDate =  new Date(roundedDate.setMinutes( roundedDate.getMinutes() - 30 ));
    }

    return roundedDate;
  };

  getRoundedHalfHourRange = (minutes, d=new Date()) => {

    let ms = 1000 * 60 * minutes;
    let roundedDate;
    roundedDate =  new Date(Math.round(d.getTime() / ms) * ms);

    if(roundedDate>d){
      roundedDate =  new Date(roundedDate.setMinutes( roundedDate.getMinutes() - 30 ));
    }

    return roundedDate;
  }

  // getMonthArrayFromDateRange(dateRange:DateRange) {
  //   var dateStart = moment(dateRange.start);
  //   var dateEnd = moment(dateRange.end);
  //   var timeValues = [];
    
  //   while (dateEnd > dateStart) {
  //      timeValues.push(dateStart.format('YYYY-MMM'));
  //      dateStart.add(1,'month');
  //   }
  //   return timeValues;
  // }

   getDateRangeDateList(dateRange: DateRange, mode) {
    var dateStart = moment(dateRange.start);
    var dateEnd = moment(dateRange.end);
    var timeValues = [];

    while (dateEnd > dateStart) {
      timeValues.push(dateStart.format('yyyy-MM-DD hh:mm:ss'));
      dateStart.add(1,mode);
    }

    return timeValues;
  }

  getToday(today: Date){
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    // date.start.setMonth(today.getMonth());
    date.start.setDate(today.getDate());
    // date.start.setFullYear(today.getFullYear());

    // date.end.setMonth(date.end.getMonth());
    date.end.setDate(date.end.getDate()+1);
    // date.end.setFullYear(date.end.getFullYear());

    return date;
  }

  getTodayUpToNow(today: Date){
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setHours(0);
    date.start.setMinutes(0);
    date.start.setSeconds(0);
    // date.start.setFullYear(today.getFullYear());

    // date.end.setMonth(date.end.getMonth());
    // date.end.setDate(date.end.getDate()+1);
    // date.end.setFullYear(date.end.getFullYear());

    return date;
  }

  getThisWeek(today: Date) {
    let date = new DateRange();
    let weekFirst = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
    let weekLast = weekFirst + 7;

    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(date.start.getMonth());
    date.start.setDate(weekFirst);

    date.end.setMonth(date.end.getMonth());
    date.end.setDate(weekLast);
    date.end.setFullYear(date.end.getFullYear());

    return date;
  }

  getLastSevenDays(today: Date){
    let date = new DateRange();
    let start = today.getDate() - 7;

    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(date.start.getMonth());
    date.start.setDate(start);

    date.end.setMonth(date.end.getMonth());
    date.end.setDate(today.getDate());
    date.end.setFullYear(date.end.getFullYear());

    return date;
  }



  getLastDays(today: Date, numOfDays, mode){
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    if(mode.includes("days")) {
      date.start.setDate(date.start.getDate()-numOfDays);
    } else if(mode.includes("month")) {
      date.start.setMonth(date.start.getMonth()-numOfDays);
    } else if(mode.includes("year")) {
      date.start.setFullYear(date.start.getFullYear()-numOfDays);
    }

    let rangeList = this.getDateRangeDateList(date, mode);

    return rangeList;
  }

  getLastDaysRange(today: Date, numOfDays, mode) {
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    if(mode.includes("days")) {
      date.start.setDate(date.start.getDate()-numOfDays);
    } else if(mode.includes("month")) {
      date.start.setMonth(date.start.getMonth()-numOfDays);
    } else if(mode.includes("year")) {
      date.start.setFullYear(date.start.getFullYear()-numOfDays);
    }

    return date;
  }


  getLastDay(today: Date) {
    let date = new DateRange();
    let start = today.getDate() - 1;

    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(date.start.getMonth());
    date.start.setDate(start);

    date.end.setMonth(date.end.getMonth());
    date.end.setDate(today.getDate());
    date.end.setFullYear(date.end.getFullYear());

    return date;
  }

  getTwoMonth(today: Date){
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);
    date.start.setDate(1);
    date.end.setDate(1);

    date.start.setMonth(date.start.getMonth()-2);
    date.end.setMonth(date.end.getMonth());
    date.end.setFullYear(date.end.getFullYear());

    return date;
  }

  getThisMonth(today: Date){
    let date = new DateRange();
    date.end = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    date.start = new Date(today);

    date.start.setMonth(date.start.getMonth());
    date.start.setDate(1);
    date.start.setFullYear(date.start.getFullYear());

    date.end.setMonth(date.end.getMonth());
    date.end.setDate(1);
    date.end.setFullYear(date.end.getFullYear());

    return date;
  }

  thisMonthUpToNow(today: Date){
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);
    date.start.setMonth(date.start.getMonth());
    date.start.setDate(1);
    return date;
  }

  getThisYear(today: Date){
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(0);
    date.start.setDate(1);
    date.start.setFullYear(date.start.getFullYear());

    date.end.setMonth(date.end.getMonth());
    date.end.setDate(date.end.getDate());
    date.end.setFullYear(date.end.getFullYear());

    return date;
  }

  getThisFullYear(today: Date){
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(0);
    date.start.setDate(1);
    date.start.setFullYear(date.start.getFullYear());

    date.end.setMonth(11);
    date.end.setDate(32);
    date.end.setFullYear(date.end.getFullYear());
    return date;
  }

  getLastyears(today: Date) {
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(0);
    date.start.setDate(1);
    date.start.setFullYear(date.start.getFullYear() - 1);

    date.end.setMonth(0);
    date.end.setDate(1);
    date.end.setFullYear(date.end.getFullYear());
    return date;
  }

  getLastFiveYear(today: Date){
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(0);
    date.start.setDate(1);
    date.start.setFullYear(date.start.getFullYear() - 5);

    date.end.setMonth(0);
    date.end.setDate(1);
    date.end.setFullYear(date.end.getFullYear());
    return date;
  }

  

  getLastMonth(today: Date){

    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(today.getMonth()-1);
    date.start.setDate(1);

    date.end.setMonth(today.getMonth());
    date.end.setDate(1);
    date.end.setFullYear(today.getFullYear());

    return date;
  }

  getLastSixMonth(today: Date){

    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setDate(1);
    date.start.setMonth(date.start.getMonth()-6);

    date.end.setMonth(today.getMonth());
    date.end.setDate(1);
    date.end.setFullYear(today.getFullYear());

    return date;
  }

  /**
   * time => 'HH:mm'
   * @param time
   */
  getHalfHourDifference(time: string) {
    let hour = parseInt(time.slice(0, 2));
    let minutes = parseInt(time.slice(3, 5));
    let start;
    let end;

    if (0 <= minutes && minutes <= 29) {
      start = '00';
      end = '30';
      if (23 <= hour) {
        return {
          startTime : `23:${start}`,
          endTime: `23:${end}`
        };
      } else {
        return {
          startTime : `${hour}:${start}`,
          endTime: `${hour}:${end}`
        };
      }
    } else {
      start = '30';
      end = '00';
      if (23 <= hour) {
        return {
          startTime : `23:${start}`,
          endTime: `00:${end}`
        };
      } else {
        return {
          startTime : `${hour}:${start}`,
          endTime: `${hour + 1}:${end}`
        };
      }
    }
  }
}
