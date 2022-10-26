import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-line2d',
  templateUrl: './line2d.component.html',
  styleUrls: ['./line2d.component.scss'],
  host: {'class': 'w-100'}
})
export class Line2dComponent implements OnInit {
  @Input() dataSource: object = {};
  constructor() { }

  ngOnInit() {
  }

}
