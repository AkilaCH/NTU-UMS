import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DateRange } from '../models/date-range';

const LIST_MONTH = [
  {label: 'January', value: 1}, {label: 'February', value: 2}, {label: 'March', value: 3}, {label: 'April', value: 4}, {label: 'May', value: 5},
  {label: 'June', value: 6}, {label: 'July', value: 7}, {label: 'August', value: 8}, {label: 'September', value: 9}, {label: 'October', value: 10},
  {label: 'November', value: 11}, {label: 'December', value: 12}
]

@Component({
  selector: 'month-date-pciker',
  templateUrl: './date-month-picker.component.html',
  styleUrls: ['./date-month-picker.component.scss']
})
export class MonthDatePickerComponent implements OnInit, OnChanges {
  @Input()
  dateRange: DateRange;
  @Input()
  fullWidth: string;
  @Input()
  minDate?: Date;
  @Input()
  maxDate?: Date;
  @Input()
  isYear?: boolean = false;
  @Input() disabled?: boolean =  false;
  @Output()
  dateRangeChange = new EventEmitter<DateRange>();

  _monthList: Array<any> = LIST_MONTH
  _yearList: any[][] = []
  _selectedYear: any = null;
  _selectedMonth: any = null
  _isYearOpened:boolean = false;
  _leftPos: number = 0;
  _boxWidth: number = 100;
  _max: number = 100;
  _showPop: boolean = false;
  _value: string = ''

  constructor(){
    
  }

  ngOnInit() {
    this._yearList = this.generateYear();
    this._selectedYear = this.dateRange ? this.dateRange.start.getFullYear() : new Date().getFullYear()
    this._selectedMonth= this.dateRange ? this.dateRange.start.getMonth() + 1 : new Date().getMonth() + 1;
    this._isYearOpened = this.isYear;
    this._value = this.getDateTextFormat(this.dateRange? this.dateRange.start : new Date())
    this._showPop = false;
  }

  getDateTextFormat = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  generateYear = () => {
    const end = new Date().getFullYear() + 5;
    const start = 1980;
    let newYear = start;
    const newArrYear: any[][] = [];
    let newArrYearItem: Array<any> = [];
    while (newYear < end) {
      newArrYearItem.push({
        label: newYear,
        value: newYear
      });
      newYear += 1;
      if(newYear % 12 == 0 || newYear >= end){
        newArrYear.push(newArrYearItem);
        newArrYearItem = []
      }
    }
    this._leftPos = ((newArrYear.length - 1) * -100);
    this.setPosLeft(newArrYear)
    // this._leftPos = ((newArrYear.length - 1) * -100);
    this._boxWidth = ((newArrYear.length) * 100);
    this._max = ((newArrYear.length - 1) * -100);
    return newArrYear;
  }

  setPosLeft = (newArrYear) => {
    for (let i = 0; i < newArrYear.length; i++) {
      const group = newArrYear[i];
      for (let j = 0; j < group.length; j++) {
        if(this._selectedYear == group[j].value){
          this._leftPos = ((i) * -100);
          break;
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dateRange || changes.disabled) {
      this.ngOnInit();
    }
  }

  onDateChange(date: NgbDate) {
    this.dateRangeChange.emit(this.dateRange);
  }

  onPickMonth = (value) => {
    this._selectedMonth = value;
    this.getDate();
    this.openPopup();
  }
  onPickYear = (value) => {
    this._selectedYear = value;
    if(this.isYear){
      this._selectedMonth = 1;
      this.getDate();
      this.openPopup();
    }else{
      // this.getDate();
      this.openPopupYear()
    }
  }

  openPopupYear = () => {
    this._isYearOpened = !this._isYearOpened;
  }

  getDate = () => {
    const date = new Date(`${this._selectedMonth}/1/${this._selectedYear}`);
    this.dateRange = {
      start: date,
      end: date
    }
    this._value = this.getDateTextFormat(date);
    this.dateRangeChange.emit(this.dateRange);
  }

  openPopup = () => {
    this._showPop = !this._showPop;
  }

  onArrowClick = (cmd: string = 'next') => {
    if(cmd === 'next'){
      if(this._leftPos > this._max){
        this._leftPos = this._leftPos - 100;
      }
    }else{
      if(this._leftPos < 0){
        this._leftPos = this._leftPos + 100;
      }
    }
  }
}
