import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-box',
  templateUrl: './confirmation-box.component.html',
  styleUrls: ['./confirmation-box.component.scss']
})
export class ConfirmationBoxComponent implements OnInit {

  @Input() massage;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  onClick(action){

  }

  close(click) {
    this.activeModal.close(click);
  }

  dismiss(click) {
    this.activeModal.dismiss(click);
  }

}
