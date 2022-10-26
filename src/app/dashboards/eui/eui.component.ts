import { Component, Input, OnInit } from '@angular/core';
import { Gfa } from 'src/app/models/interface/gfa';
import { GfaProp } from 'src/app/models/interface/gfa-prop';
import { GfaService } from 'src/app/services/dashboards/gfa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'ums-eui',
  templateUrl: './eui.component.html',
  styleUrls: ['./eui.component.scss']
})
export class EuiComponent implements OnInit {

  @Input() id: number = 0;

  dryGfa: number = 0;

  wetGfa: number = 0;

  otherGfa: number = 0;

  dryGfaCurrent: number = 0;

  wetGfaCurrent: number = 0;

  otherGfaCurrent: number = 0;

  totalGfaCurrent: number = 0;

  // 0 = building, 1 = building groups
  @Input() type: number = 0;

  constructor(private gfaService: GfaService) { }

  ngOnInit() {
    this.SetupCurrentGfa();
  }

  private SetupCurrentGfa() {
    if(this.type == 0) {
      this.gfaService.getBuildingGfa(this.id).then(gfa => {
        this.setGfaProps(gfa);
      });
    }else if(this.type == 1) {
      this.gfaService.getBuildingGroupGfa(this.id).then(gfa => {
        this.setGfaProps(gfa);
      });
    }
  }

  private setGfaProps(gfa: Gfa) {
    this.dryGfaCurrent = gfa.dry;
    this.wetGfaCurrent = gfa.wet;
    this.otherGfaCurrent = gfa.other;
    this.totalGfaCurrent = gfa.total;
  }

  updateGfa(type: string) {
    Swal.fire({
      title: '',
      text: "Are you sure you want to update?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(result => {
      if (result.isConfirmed) {
        let gfa: GfaProp = { 
          id: this.id,
          type: this.type,
          category: null,
          value: null
        };
    
        switch(type) {
          case 'gfa_dry': {
            gfa.category = 'gfa_dry';
            gfa.value = this.dryGfa;
            break;
          }
          case 'gfa_wet': {
            gfa.category = 'gfa_wet';
            gfa.value = this.wetGfa;
            break;
          }
          case 'gfa_other': {
            gfa.category = 'gfa_other';
            gfa.value = this.otherGfa;
            break;
          }
          default:
            break;
        }
    
        this.gfaService.updateGfa(gfa).then(data => {
          if(data == true) {
            this.SetupCurrentGfa();
            Swal.fire(
              '',
              'Successfully updated Gross Floor Area (GFA)!',
              'success'
            )
          }else {
            Swal.fire(
              '',
              'Something went wrong. Please try again later!',
              'error'
            )
          }
        }).catch(error => {
          Swal.fire(
            '',
            'Something went wrong. Please try again later!',
            'error'
          )
        });
      } 
    });
  }

  getAbs(value: number) {
    return Math.abs(value);
  }
}
