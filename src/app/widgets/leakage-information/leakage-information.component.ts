import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-leakage-information',
  templateUrl: './leakage-information.component.html',
  styleUrls: ['./leakage-information.component.scss']
})
export class LeakageInformationComponent implements OnInit {

  @Input() data = {
    time: undefined,
    meters: undefined,
    maxError: undefined,
    error: undefined,
    direction : undefined,
    directionName:undefined,
  };

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() 
  {

    if (this.data.direction == "LTR") 
    {
        this.data.directionName="Left to Right";
    }
    else if (this.data.direction == "RTL") 
    {
      this.data.directionName="Right to Left";
    }
  }

  close() {
    this.activeModal.close();
  }

  
}
