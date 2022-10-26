import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss']
})
export class ToggleButtonComponent implements OnInit {

  @Input() switch = false;
  @Output() switchChange = new EventEmitter<boolean>();
  key = Math.random();

  constructor() { }

  ngOnInit() {
  }

}
