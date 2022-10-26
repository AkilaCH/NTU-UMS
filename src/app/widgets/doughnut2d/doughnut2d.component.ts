import { Component, OnInit, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-doughnut2d',
  templateUrl: './doughnut2d.component.html',
  styleUrls: ['./doughnut2d.component.scss']
})
export class Doughnut2dComponent implements OnInit {

  @Input() dataSource: object = [];
  @Input() fixedWidth = false;

  chartWidth = new BehaviorSubject<any>('100%');

  constructor(private headerService: HeaderService) { }

  ngOnInit() {
    if (this.fixedWidth) {
      this.headerService.getChartWidth().subscribe(res => {
        this.chartWidth.next(res);
      });
    }
  }
}
