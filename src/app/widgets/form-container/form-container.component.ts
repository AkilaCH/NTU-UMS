import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss']
})
export class FormContainerComponent implements OnInit {
  @Input() fieldName: string;
  constructor() { }

  ngOnInit() {
  }

}
