import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-multiplechart-2d',
  templateUrl: './multiplechart-2d.component.html',
  styleUrls: ['./multiplechart-2d.component.scss'],
  host: {'class': 'w-100'}
})
export class Multiplechart2dComponent implements OnInit {

  @Input() dataSource: object = [];
  
  constructor() { }

  ngOnInit() {
  }
}
