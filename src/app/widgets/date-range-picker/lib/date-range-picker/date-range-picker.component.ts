import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { NgbInputDatepicker, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DateRange } from '../models/date-range';
import { NgbDateNativeAdapter } from '../services/NgbDateNativeAdapter';
import { NotifierService } from 'angular-notifier';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css']
})
export class DateRangePickerComponent implements OnInit, OnChanges {
  @Input()
  dateRange: DateRange;
  @Input()
  fullWidth: string;
  @Input()
  minDate?: Date;
  @Input()
  maxDate?: Date;
  @Input()
  maxDateRange?: string;
  @Input()
  isSingleDate?: boolean;
  @Input()
  disabled?= false;
  @Input()
  position?=null;
  @Output()
  dateRangeChange = new EventEmitter<DateRange>();
  hoveredDate: NgbDate;
  maxAllowDateRange: number;

  private readonly notifier: NotifierService;

  private fromDate: NgbDate;
  private toDate: NgbDate;
  private min: NgbDate | null;
  private max: NgbDate | null;
  @ViewChild('dp', { read: ElementRef, static: true })
  private inputElRef: ElementRef;
  @ViewChild('dp', { static: true })
  private dp: NgbInputDatepicker;

  constructor(
    private readonly dateAdapter: NgbDateNativeAdapter,
    notifierService: NotifierService,
    private http: HttpClient
    ) {
    this.notifier = notifierService;
    this.getSiteConfig().subscribe(data => {
      this.maxAllowDateRange = data.maxAllowDateRange;
     });
  }

  public getSiteConfig(): Observable<any> {
    return this.http.get('assets/configs/site-configs.json');
  }

  ngOnInit() {
    this.fromDate = this.dateAdapter.fromModel(this.dateRange.start);
    this.toDate = this.dateAdapter.fromModel(this.dateRange.end);
    this.min = this.minDate ? this.dateAdapter.fromModel(this.minDate) : null;
    this.max = this.maxDate ? this.dateAdapter.fromModel(this.maxDate) : null;
    this.inputElRef.nativeElement.value = this.formatInputText();
    if (this.fromDate) {
      this.dp.startDate = {
        year: this.fromDate.year,
        month: this.fromDate.month
      };
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dateRange || changes.disabled) {
      this.ngOnInit();
    }
  }

  onDateChange(date: NgbDate, dp: NgbInputDatepicker) {
    let tempFromDate = this.dateAdapter.toModel(this.fromDate);
    let tempDate = this.dateAdapter.toModel(date);
    if(this.isSingleDate){
      this.toDate = date;
      this.fromDate = date;
      this.dateRange.start = this.dateAdapter.toModel(this.fromDate);
      this.dateRange.end = this.dateAdapter.toModel(this.fromDate);
      this.dateRangeChange.emit(this.dateRange);
      dp.close();
      return
    }
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.dateRange.start = this.dateAdapter.toModel(this.fromDate);
    } else if (this.fromDate && !this.toDate && (tempDate>=tempFromDate)) {
      this.toDate = date;
      const tempEnd = this.dateAdapter.toModel(this.toDate);
      this.dateRange.end = new Date(this.dateAdapter.toModel(this.toDate).setDate(this.dateAdapter.toModel(this.toDate).getDate() + 1));

      const date1: any = new Date(this.dateRange.end);
      const date2: any = new Date(this.dateRange.start);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffYears = Math.ceil(diffDays / 365);

      if (this.maxDateRange == '1month' && diffDays > this.maxAllowDateRange) {
        this.notifier.notify('warning', `Please Select a Valid Range. Maximum Date Range is ${this.maxAllowDateRange} days`);
      } else if (this.maxDateRange == '5years' && diffYears > 5) {
        this.notifier.notify('warning', 'Please Select a Valid Range. Maximum Date Range is 5 Years');
      } else {
        this.dateRangeChange.emit(this.dateRange);
      }

      this.dateRange.end = tempEnd;
      dp.close();
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.dateRange.start = this.dateAdapter.toModel(this.fromDate);
      this.dateRange.end = null;
    }
    this.inputElRef.nativeElement.value = this.formatInputText();
  }

  private formatInputText(): string {
    if ((this.dateRange.end !== null) &&
      (this.dateRange.start.toDateString() ==
      this.dateRange.end.toDateString())
    ) {
      return `${this.dateRange.start.toLocaleDateString()}`;
    } 
    else if (
      this.dateRange.start &&
      this.dateRange.end &&
      DateRange.isValidDate(this.dateRange.start) &&
      DateRange.isValidDate(this.dateRange.end)
    ) {
      return `${this.dateRange.start.toLocaleDateString()} - ${this.dateRange.end.toLocaleDateString()}`;
    } 
    return '';
  }

  isHovered(date) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }
  isInside = date => date.after(this.fromDate) && date.before(this.toDate);
  isFrom = date => date.equals(this.fromDate);
  isTo = date => date.equals(this.toDate);
  isWeekend(date: NgbDate) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }
  isDisabled = date => date.after(this.max) || date.before(this.min);
  isInFuture = date => date.after(this.toDate);

}
