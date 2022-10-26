import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { InitialService } from 'src/app/services/initial.service';
import { ChartColorMap, DevicerNumber } from 'src/enums/chart-color-map';
import { DECIMAL_MAP } from 'src/enums/chart-config-map';
import { fixDecimalNumPrecision, moneyFormat } from 'src/util/ChartHelper';
import { abbreviateNumber } from '../../../util/ChartHelper';

@Component({
  selector: 'app-total-comsumption',
  templateUrl: './total-comsumption.component.html',
  styleUrls: ['./total-comsumption.component.scss']
})
export class TotalConsumptionComponent implements OnInit {

  @Input() value: any = "N/A";

  @Input() unit: string = "N/A";
  @Input() type: string = "N/A";

  suffix = '';
  @Input() color?: any = null;

  convertNumberAndSuffic(number){
    if(this.value === null || this.value === undefined || this.value == 0 ){
      this.value = 'N/A'
    }

    const { scalledNumber, suffix, unit } = abbreviateNumber(number);

    if(!scalledNumber) return null;

    this.value = scalledNumber;
    this.unit = this.unit ? this.unit : 'kWh';

    const type = this.type ? this.type.toString().toLowerCase() : '';

    if(type == 'wh' || type == 'kwh' || type == 'kgco2' || type == 'kwhm2'){
      this.suffix = '';
      this.value = moneyFormat((number / DevicerNumber.electrical).toFixed(DECIMAL_MAP.electricalTodayConsumption));
      this.color =  this.color ? this.color: ChartColorMap.electric.primary;
    }else{
      this.unit = this.unit;
      this.suffix = suffix;
      this.color =  this.color ? this.color: ChartColorMap.water.secondary;
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    this.convertNumberAndSuffic(Number(this.value));
  }

  constructor(private config: InitialService) { }

  ngOnInit() {
    this.convertNumberAndSuffic(Number(this.value));
  }

}
