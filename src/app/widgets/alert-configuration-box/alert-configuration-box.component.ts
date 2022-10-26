import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert-configuration-box',
  templateUrl: './alert-configuration-box.component.html',
  styleUrls: ['./alert-configuration-box.component.scss']
})
export class AlertConfigurationBoxComponent implements OnInit {

  @Input() alertInfo;
  benchMarkForm: FormGroup;

  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) { }

  ngOnInit() {
    let formData = this.alertInfo.data.row;
    this.benchMarkForm = this.fb.group({
      sundayBV: [formData.sundayBenchMark, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,100})?$')]],
      mondayBV: [formData.mondayBenchMark, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,100})?$')]],
      tuesdayBV: [formData.tuesdayBenchMark, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,100})?$')]],
      wednesdayBV: [formData.wednesdayBenchMark, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,100})?$')]],
      thursdayBV: [formData.thursdayBenchMark, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,100})?$')]],
      fridayBV: [formData.fridayBenchMark, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,100})?$')]],
      saturdayBV: [formData.saturdayBenchMark, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,100})?$')]]
    });
  }

  get sundayBV() {
    return this.benchMarkForm.get('sundayBV');
  }
  get mondayBV() {
    return this.benchMarkForm.get('mondayBV');
  }
  get tuesdayBV() {
    return this.benchMarkForm.get('tuesdayBV');
  }
  get wednesdayBV() {
    return this.benchMarkForm.get('wednesdayBV');
  }
  get thursdayBV() {
    return this.benchMarkForm.get('thursdayBV');
  }
  get fridayBV() {
    return this.benchMarkForm.get('fridayBV');
  }
  get saturdayBV() {
    return this.benchMarkForm.get('saturdayBV');
  }

  submitForm() {
    this.activeModal.close([{
      MeterId: this.alertInfo.data.row.meterID,
      Benchmarks: [
        {
          Day: 1,
          Value: this.benchMarkForm.value.sundayBV
        },
        {
          Day: 2,
          Value: this.benchMarkForm.value.mondayBV
        },
        {
          Day: 3,
          Value: this.benchMarkForm.value.tuesdayBV
        },
        {
          Day: 4,
          Value: this.benchMarkForm.value.wednesdayBV
        },
        {
          Day: 5,
          Value: this.benchMarkForm.value.thursdayBV
        },
        {
          Day: 6,
          Value: this.benchMarkForm.value.fridayBV
        },
        {
          Day: 7,
          Value: this.benchMarkForm.value.saturdayBV
        },
      ]
    }]);
  }
}
