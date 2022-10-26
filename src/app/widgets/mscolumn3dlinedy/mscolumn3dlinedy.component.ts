import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mscolumn3dlinedy',
  templateUrl: './mscolumn3dlinedy.component.html',
  styleUrls: ['./mscolumn3dlinedy.component.scss'],
  host: {'class': 'w-100'}
})
export class Mscolumn3dlinedyComponent implements OnInit {

  @Input() dataSource: object = [];
  
  constructor() { }

  ngOnInit() {
  }

}
