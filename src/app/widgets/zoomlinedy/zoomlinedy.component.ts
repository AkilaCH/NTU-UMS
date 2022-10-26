import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-zoomlinedy',
  templateUrl: './zoomlinedy.component.html',
  styleUrls: ['./zoomlinedy.component.scss'],
  host: {'class': 'w-100'}
})
export class ZoomlinedyComponent implements OnInit {

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
