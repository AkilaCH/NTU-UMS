import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import MeterTreeConfig from '../../../assets/configs/meter-tree.json';
import { Observable } from 'rxjs';
import { HeaderService } from '../../services/header.service';
import { InitialService } from 'src/app/services/initial.service';

declare function DrawTree(location, [], {}, mode, type): any;
@Component({
  selector: 'app-meter-tree',
  templateUrl: './meter-tree.component.html',
  styleUrls: ['./meter-tree.component.scss']
})
export class MeterTreeComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() dataSource: any;
  @Input() configurations: any = null;
  @Input() building: string;
  @Input() mode = true;
  @Input() type: string;

  noData =  false;
  chartWidth: Observable<number>;

  constructor(private configs: InitialService) {}

  ngOnChanges(changes: SimpleChanges) {
    if( this.configurations == null ) {
      this.configurations = {...MeterTreeConfig, decimalNumPrecision: this.configs.siteConfigurations.decimalNumPrecision};
    }
    if (!this.dataSource ) {
      this.noData = true;
    } else {
      if(this.dataSource.children.length <= 0){
        this.noData = true;
      }else{

        this.noData = false;
        this.updateChart(this.dataSource, this.configurations, this.mode, this.type);
      }
    }
  }

  ngOnInit() {
  }

  updateChart(res: any[], configs, mode, type) {
    setTimeout(() => {
      DrawTree('#meter-tree', res, configs, '#fakeTree', type);
    }, 1500);
  }
}
