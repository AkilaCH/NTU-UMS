import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { fixDecimalNumPrecision } from 'src/util/ChartHelper';
import { ThousandSeparatorPipe } from 'src/app/pipes/thousand-separator.pipe';
import { InitialService } from 'src/app/services/initial.service';
import { abbreviateNumber } from '../../../util/ChartHelper';
import { DevicerNumber } from 'src/enums/chart-color-map';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {

  @Input() oldValue: number;
  @Input() newValue: number;
  @Input() unit: string = "N/A";

  diffValue: any;
  changeInConsumption: string;
  percentile: string;
  isIncreased: boolean;

  constructor(private config: InitialService, private thousandSeparator: ThousandSeparatorPipe) {}

  convertNumberAndSuffic(number){
    let { scalledNumber, suffix, unit } = abbreviateNumber(number);
    if(!scalledNumber) return null;
    this.diffValue = scalledNumber;
    
    if(this.unit.toLowerCase() == 'kwh'){
      this.unit = 'kWh';
      this.diffValue = (number / DevicerNumber.electrical).toFixed(0)
      suffix = '';
    }else{
      this.unit = this.unit;
      // this.diffValue = `${this.round(this.diffValue, 2)}`;
    }

    if (this.diffValue == 0) {
      this.changeInConsumption = 'N/A';
    } else {
      this.changeInConsumption = `${this.diffValue}${suffix} ${this.unit}`;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.diffValue = this.newValue - this.oldValue;
    if(this.diffValue > 0) {
      this.isIncreased = true;
    }

    this.diffValue = Math.abs(this.diffValue);
    if (this.oldValue === null || this.oldValue === 0 || this.newValue === this.oldValue) {
      this.percentile = null;
    } else {
      this.percentile = `${fixDecimalNumPrecision((this.diffValue / this.oldValue) * 100, this.config.siteConfigurations.decimalNumPrecision)}%`;
    }

    this.convertNumberAndSuffic(Number(this.diffValue));
    // if (Number(this.diffValue) > 10_000_000_000) {
    //   this.diffValue = `${this.round((Number(this.diffValue) / 1000_1000_1000).toString(), 2)}`;
    //   if (this.unit === 'kWh') {
    //     this.unit = ' TWh';
    //   } else {
    //     this.unit = `G ${this.unit}`;
    //     this.diffValue = `${this.round(this.diffValue, 2)}`;
    //   }
    // } else if (Number(this.diffValue) > 10_000_000) {
    //   this.diffValue = `${this.round((Number(this.diffValue) / 1000_1000).toString(), 2)}`;
    //   if (this.unit === 'kWh') {
    //     this.unit = ' GWh';
    //   } else {
    //     this.unit = `M ${this.unit}`;
    //     this.diffValue = `${this.round(this.diffValue, 2)}`;
    //   }
    // } else if (Number(this.diffValue) > 10_000) {
    //   this.diffValue = `${this.round((Number(this.diffValue) / DevicerNumber.electrical).toString(), 2)}`;
    //   if (this.unit === 'kWh') {
    //     this.unit = ' MWh';
    //   } else {
    //     this.unit = `K ${this.unit}`;
    //     this.diffValue = `${this.round(this.diffValue, 2)}`;
    //   }
    // } else {
    //   this.diffValue = `${this.round(Number(this.diffValue).toString(), 2)} `;
    //   if (this.unit === 'kWh') {
    //     this.unit = this.unit;
    //   } else {
    //     this.unit = this.unit;
    //   }
    // }
    // if (this.diffValue == 0) {
    //   this.changeInConsumption = 'N/A';
    // } else {
    //   this.changeInConsumption = `${this.thousandSeparator.transform(this.diffValue)} ${this.unit}`;
    // }
   
  }

  ngOnInit() {}

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}
