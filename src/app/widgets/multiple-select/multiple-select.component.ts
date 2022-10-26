import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.scss']
})
export class MultipleSelectComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChildren('checks') checks: QueryList<ElementRef>;

  @Input() options: any = []; 
  @Input() selected: number[] = [];

  @Output() onSelect: EventEmitter<number[]>;

  expanded: boolean;
  
  constructor() {
    this.expanded = false;
    this.onSelect = new EventEmitter<number[]>();
   }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selected = changes.selected;

    if (this.checks && selected && selected.currentValue != selected.previousValue) {
      this.setAll();
    }
  }

  ngAfterViewInit(): void {
    this.setAll();
  }

  
  setAll() {
    this.options.forEach((option, i) => {
      const found = this.selected.indexOf(option.id) > -1;

      this.checks.toArray()[i + 1].nativeElement.checked = this.all;
    });

    this.checks.first.nativeElement.checked = this.all;
  }

  showCheckboxes() {
    this.expanded = !this.expanded;
  }

  selectAll(event) {
    const checked = event.target.checked;
    this.checks.forEach(el => el.nativeElement.checked = checked);

    this.selected = checked ? this.options.map(x => x.id) : [];

    this.onSelect.emit(this.selected);
  }

  select(id) {
    const index = this.selected.findIndex(x => x == id);

    if (index > -1)
      this.selected.splice(index, 1);
    else
      this.selected.push(id);

    this.checks.first.nativeElement.checked = this.all;

    this.onSelect.emit(this.selected);
  }

  get all(): boolean {
    return this.options.length == this.selected.length
  }

  get selectedNames(): string {
    return this.selected.length == 0 ? 'Select option' : 
      this.all ? 'All' :
        this.options.filter(x => this.selected.indexOf(x.id) > -1).map(x => x.name).join(', ');
  }

}
