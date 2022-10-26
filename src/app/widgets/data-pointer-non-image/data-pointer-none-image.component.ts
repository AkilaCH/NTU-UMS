import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { InitialService } from 'src/app/services/initial.service';
import { DevicerNumber } from 'src/enums/chart-color-map';
import { DECIMAL_MAP } from 'src/enums/chart-config-map';
import { fixDecimalNumPrecision, moneyFormat } from 'src/util/ChartHelper';
import { abbreviateNumber } from '../../../util/ChartHelper';

@Component({
  selector: 'app-data-pointer-none-image',
  templateUrl: './data-pointer-none-image.component.html',
  styleUrls: ['./data-pointer-none-image.component.scss'],
  host: {'class': 'w-100 d-flex align-items-center justify-content-center flex-column'}
})
export class DataPointerNoneImageComponent implements OnInit {

  @Input() pointerText: any = "N/A";

  @Input() unit: string = "N/A";

  @Input() description: string = "N/A";

  @Input() type: string;

  @Input() color: string = '#333';


  suffix = '';
  convertNumberAndSuffic(number){
    if(this.pointerText === null || this.pointerText === undefined ){
      this.pointerText = 'N/A'
    }

    const { scalledNumber, suffix, unit } = abbreviateNumber(number);
    if(!scalledNumber) return null;
    this.pointerText = scalledNumber;
    const type = this.type ? this.type.toString().toLowerCase() : '';
    if(type.toLowerCase() == 'wh'){
      this.unit = 'Wh';
      this.suffix = suffix;
    }else if(type.toLowerCase() == 'kwh'){
      this.unit = 'kWh';
      this.suffix = '';
      this.pointerText = moneyFormat((number / DevicerNumber.electrical).toFixed(DECIMAL_MAP.trendLogs));
    }else if(type.toLowerCase() == 'kgco2'){
      this.unit = 'kgCO<sub>2</sub>';
      this.suffix = '';
      this.pointerText = moneyFormat((number / DevicerNumber.electrical).toFixed(DECIMAL_MAP.trendLogs));
    }else if(type.toLowerCase() == 'kwhm2'){
      this.suffix = '';
      this.pointerText = moneyFormat((number / DevicerNumber.electrical).toFixed(DECIMAL_MAP.electricalTodayConsumption));
    }else{
      this.unit = this.unit;
      this.suffix = suffix;
    }

   
    
  }

  ngOnChanges(changes: SimpleChanges) {
    this.convertNumberAndSuffic(Number(this.pointerText));
    // if(Number(this.pointerText) > 10000000000){
    //   this.pointerText = `${this.round((((Number(this.pointerText)/1000)/1000)/1000).toString(), 2)}`;
    //   if(this.type === 'kwh'){
    //     this.unit = "TWh";
    //   } else {
    //     this.unit = this.unit;
    //     this.pointerText = `${this.round(this.pointerText, 2)}`;
    //     this.suffix = 'G';
    //   }
    // } else if(Number(this.pointerText) > 10000000){
    //   this.pointerText = `${this.round(((Number(this.pointerText)/1000)/1000).toString(), 2)}`;
    //   if(this.type === 'kwh'){
    //     this.unit = "GWh";
    //   } else {
    //     this.unit = this.unit;
    //     this.pointerText = `${this.round(this.pointerText, 2)}`;
    //     this.suffix = 'M';
    //   }
    // } else if(Number(this.pointerText) > 10000){
    //   this.pointerText = `${this.round((Number(this.pointerText)/1000).toString(), 2)}`;
    //   if(this.type === 'kwh'){
    //     this.unit = "MWh";
    //   } else {
    //     this.unit = this.unit;
    //     this.pointerText = `${this.round(this.pointerText, 2)}`;
    //     this.suffix = 'K';
    //   }
    // } else {
    //   if(this.type === 'kwh'){
    //     this.unit = 'kwh';
    //   } else {
    //     this.unit = this.unit;
    //   }
    //   this.pointerText = fixDecimalNumPrecision(this.pointerText, this.config.siteConfigurations.decimalNumPrecision);
    // }
  }

  round(value, precision): any {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
  }

  constructor(private config: InitialService) { }

  ngOnInit() {
    
    
    this.convertNumberAndSuffic(Number(this.pointerText));
    // if(Number(this.pointerText) > 10000){
    //   if(this.type === 'wh'){
    //     this.unit = "MWh";
    //   } else {
    //     this.unit = this.unit;
    //     this.pointerText = `${this.round(this.pointerText, 3)}`;
    //     this.suffix = 'K';
    //   }
    // }
  }

}