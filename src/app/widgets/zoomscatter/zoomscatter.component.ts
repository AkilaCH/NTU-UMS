import { Component, OnInit, Input } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-zoomscatter',
  templateUrl: './zoomscatter.component.html',
  styleUrls: ['./zoomscatter.component.scss'],
  host: {'class': 'w-100'}
})
export class ZoomscatterComponent implements OnInit {

  @Input() dataSource = {};
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
