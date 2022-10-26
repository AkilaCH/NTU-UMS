import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
// import { Icon } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.scss']
})
export class FloatingButtonComponent implements OnInit {

  @Input() icon: any;
  @Input() disable = false;
  @Output() clickOn: EventEmitter<any> =  new EventEmitter();

  constructor() { }


  ngOnInit() {
  }

  onClick() {
    this.clickOn.emit(null);
  }

}
