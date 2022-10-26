import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trend',
  templateUrl: './trend.component.html',
  styleUrls: ['./trend.component.scss'],
  host: {'class': 'w-100'}
})
export class TrendComponent implements OnInit {

  @Input() dataSource: object = {};

  constructor() { }

  ngOnInit() {
  }

}
