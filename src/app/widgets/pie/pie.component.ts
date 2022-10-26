import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss'],
  host: {'class': 'w-100'}
})
export class PieComponent implements OnInit {

  @Input() dataSource: object = [];

  constructor() { }

  ngOnInit() {
  }
}
