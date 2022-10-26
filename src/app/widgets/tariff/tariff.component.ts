import { Component, Input, OnInit } from '@angular/core';
import { Tariff } from 'src/app/models/interface/tariff';
import { TariffService } from 'src/app/services/tariff/tariff.service';
import { BuildingLevelType } from 'src/enums/building-level-type.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'ums-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.scss']
})
export class TariffComponent implements OnInit {

  currentTariff: number = 0;

  currentEffectiveFrom: Date = new Date();

  tariff: number = 0;

  effectiveFrom: Date = new Date();

  isEdit: boolean = false;

  @Input() type: BuildingLevelType;

  siteId: number = 1;

  @Input() buildingGroupId: number = 0;

  @Input() buildingId: number = 0;

  constructor(private tariffService: TariffService) { }

  ngOnInit() {
  }

  updateTariff() {
    Swal.fire({
      title: '',
      text: 'Are you sure you want to update?',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true
    }).then(result => {
      if(result.isConfirmed) {
        let tariff: Tariff = {
          siteId: this.siteId,
          type: this.type,
          buildingGroupId: this.buildingGroupId,
          buildingId: this.buildingId,
          rate: this.tariff
        };
        
        this.tariffService.updateTariff(tariff).then(res => {
          if(res == true) {
            Swal.fire(
              '',
              'Successfully updated Tariff!',
              'success'
            );
          }
          else {
            Swal.fire(
              '',
              'Something went wrong. Please try again later!',
              'error'
            );
          }
        }).catch(error => {
          Swal.fire(
            '',
            'Something went wrong. Please try again later!',
            'error'
          );
        });
      }
    });
  }
}
