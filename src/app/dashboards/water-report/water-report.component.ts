import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { ReportService } from 'src/app/services/dashboards/report.service';
import { ServiceType } from 'src/enums/ServiceType';
import { LocationType } from 'src/enums/location-type.enum';
import { ReportType } from 'src/enums/report-type.enum';

@Component({
  selector: 'app-water-report',
  templateUrl: './water-report.component.html',
  styleUrls: ['./water-report.component.scss']
})
export class WaterReportComponent implements OnInit {

  tabIndex: number;
  isLoading: boolean;
  isSchedulesLoading: boolean;
  buttonText: string;
  locationType: LocationType;
  scheduleData: any[] = [];
  serviceType = ServiceType;

  constructor(private headerService: HeaderService, private reportService: ReportService) {
    this.tabIndex = 0;
  }

  ngOnInit() {
    this.headerService.setItem('Reports');
    this.headerService.setBoardLevel(2);
  }

  setTabIndex(index: number) {
    this.tabIndex = index;
  }

  initialData(event) {
    this.isLoading = true;
    this.reportService.isReportAvailable(
      event.categoryId,
      LocationType[event.categoryName],
      ServiceType.WATER,
      ReportType[event.reportType],
      event.dateRange
    ).then(res => {
      this.buttonText = res;
      this.isLoading = false;
    });
  }

  reGenerate(event) {
    this.isLoading = true;
    this.reportService.generateReport(
      event.categoryId,
      LocationType[event.categoryName],
      ServiceType.WATER,
      ReportType[event.reportType],
      event.dateRange,
      this.buttonText
      ).then(res => {
        this.buttonText = res;
        this.isLoading = false;
      });
  }

  downloadExcel(event) {
    this.reportService.downloadAsExcel(
      event.categoryId,
      LocationType[event.categoryName],
      ServiceType.WATER,
      ReportType[event.reportType],
      event.dateRange);
  }

  onChangeLocation(event) {
    this.locationType = event;
    this.fetchSchedules(event);
  }

  fetchSchedules(locationType) {
    this.scheduleData = [];
    this.isSchedulesLoading = true;
    this.reportService.getSchedules(ServiceType.WATER, LocationType[locationType]).then((res: any) => {
      this.scheduleData = res;
      this.isSchedulesLoading = false;
    });
  }

  insertData(event) {
    this.isSchedulesLoading = true;
    let newData = event;
    newData.serviceType = ServiceType.WATER;
    this.reportService.insertSchedule(newData).then(res => {
      this.fetchSchedules(this.locationType);
    });
  }

  updateData(data) {
    this.isSchedulesLoading = true;
    data.updatedDta.serviceType = ServiceType.WATER;
    this.reportService.editSchedule(data.scheduleId, data.updatedDta).then(res => {
      this.fetchSchedules(this.locationType);
    });
  }

  deleteSchedule(id) {
    this.isSchedulesLoading = true;
    this.reportService.deleteSchedule(id).then(res => {
      this.fetchSchedules(this.locationType);
    });
  }
}
