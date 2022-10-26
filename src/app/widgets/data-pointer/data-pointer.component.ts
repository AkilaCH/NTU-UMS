import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { InitialService } from 'src/app/services/initial.service';
import { DevicerNumber } from 'src/enums/chart-color-map';
import { fixDecimalNumPrecision, moneyFormat } from 'src/util/ChartHelper';
import { abbreviateNumber } from '../../../util/ChartHelper';

@Component({
  selector: 'app-data-pointer',
  templateUrl: './data-pointer.component.html',
  styleUrls: ['./data-pointer.component.scss'],
  host: {'class': 'w-100 h-100'}
})
export class DataPointerComponent implements OnInit {

  @Input() pointerText: any = "N/A";

  @Input() unit: string = "N/A";

  @Input() description: string = "N/A";

  @Input() type: string;

  @Input() color: string = '#333';

  @Input() image: string = '';

  @Input() isDone: any = true;

  suffix = '';
  convertNumberAndSuffic(number){

    if(this.pointerText === null || this.pointerText === undefined ){
      this.pointerText = 'N/A'
    }

    const { scalledNumber, suffix, unit } = abbreviateNumber(number);
    if(!scalledNumber) return null;
    this.pointerText = scalledNumber;
    const type = this.type ? this.type.toString().toLowerCase() : '';
    if(type == 'wh'){
      this.unit = 'Wh';
      this.suffix = suffix;
    }else if(type == 'kwh'){
      this.unit = 'kWh';
      this.suffix = suffix;
      this.suffix = '';
      this.pointerText = moneyFormat((number / DevicerNumber.electrical).toFixed());
    }else if(type == 'kgco2'){
      this.unit = 'kgCO<sub>2</sub>';
      this.suffix = '';
      this.pointerText = moneyFormat((number / DevicerNumber.electrical).toFixed());
    }else if(type.toLowerCase() == 'kwhm2'){
      this.suffix = '';
      this.pointerText = moneyFormat((number / DevicerNumber.electrical).toFixed());
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
