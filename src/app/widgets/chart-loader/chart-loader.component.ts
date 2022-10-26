import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-chart-loader',
  templateUrl: './chart-loader.component.html',
  styleUrls: ['./chart-loader.component.scss'],
  host: {'class': 'd-flex w-100 flex-1 h-100'}
})
export class ChartLoaderComponent implements OnInit {
  constructor() {}

  @Input() isDone: any = true;

  ngOnChanges(changes: SimpleChanges) {
    // this.isDone = changes.isDone;
    // console.log(this.isDone);
    
  }

  ngOnInit() {

  }

}
