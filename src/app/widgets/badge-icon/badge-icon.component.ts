import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-badge-icon',
  templateUrl: './badge-icon.component.html',
  styleUrls: ['./badge-icon.component.scss']
})
export class BadgeIconComponent implements OnInit {

  @Input() icon;
  @Input() badgeText;
  @Output() onClick:EventEmitter<object> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  iconOnClick(event) {
    this.onClick.emit(event);
  }

}
