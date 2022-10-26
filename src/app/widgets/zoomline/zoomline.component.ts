import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-zoomline',
  templateUrl: './zoomline.component.html',
  styleUrls: ['./zoomline.component.scss'],
  host: {'class': 'w-100'}
})
export class ZoomlineComponent implements OnInit {

  @Input() dataSource = {};
  @Input() fixedWidth = false;
  @Input() height?: string = '100%';

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
