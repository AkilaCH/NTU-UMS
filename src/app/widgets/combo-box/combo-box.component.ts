import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.scss']
})
export class ComboBoxComponent implements OnInit {
  @Input() dataSource: any;
  @Input() dark: any = 'true';
  @Input() fullWidth = 'true';
  @Input() selected = 0;
  @Input() enableAll = true;
  @Input() disable = false;
  @Output() selectedChange: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.dataSource;
  }

  ngOnInit() {}

  onChangedSelect(e){
    this.selected=e.target.value;
    this.selectedChange.emit({value: e.target.value});
  }
}
