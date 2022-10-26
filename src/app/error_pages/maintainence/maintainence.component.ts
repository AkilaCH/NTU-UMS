import { Component, OnInit } from '@angular/core';
import { InitialService } from 'src/app/services/initial.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintainence',
  templateUrl: './maintainence.component.html',
  styleUrls: ['./maintainence.component.scss']
})
export class MaintainenceComponent implements OnInit {

  dueDate: any;

  constructor(private initialService: InitialService, private route: Router) {
    if(!this.initialService.isUnderMaintenece()){
      this.route.navigate(['/']);
    } 
    this.dueDate = this.initialService.getMaintainDueDate();
   }

  ngOnInit() {
    
  }
}
