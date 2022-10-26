import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit {
  toggle: boolean = false;
  @Output() onChange = new EventEmitter();
  @Input() size = "lg";
  @Input() disabled: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  toggleChanged() {
    this.onChange.emit(this.toggle);
  }

}
