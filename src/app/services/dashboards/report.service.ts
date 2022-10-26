import { Injectable } from '@angular/core';
import { ServiceType } from '../../../enums/ServiceType';
import { HttpService } from '../http.service';
import { DateRange } from 'src/app/widgets/date-range-picker/public-api';
import { DatePipe } from '@angular/common';
import { buildPlaceholder } from 'src/util/StringHelper';
import { InitialService } from '../initial.service';
import { NotifierService } from 'angular-notifier';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly notifier: NotifierService;

  constructor(
    private httpService: HttpService,
    private configs: InitialService,
    private datePipe: DatePipe,
    private initialService: InitialService,
    private notifierService: NotifierService
    ) {
      this.notifier = this.notifierService;
    }

  async generateReport(categoryId, categoryName, serviceType: ServiceType, reportType, dateRange: DateRange, buttonText) {
    try {
      let res = await this.httpService.get(this.configs.endPoints['generate-report'], {
        categoryId,
        categoryName,
        serviceType,
        reportType,
        from: this.datePipe.transform(dateRange.start, 'yyyy/MM/dd'),
        to: this.datePipe.transform(dateRange.end, 'yyyy/MM/dd')
      }).toPromise();
      if (res.StatusCode == 200 && res.Message == 'Success') {
        if (buttonText == 'Regenerate'){
          this.notifier.notify('success', 'Report Successfully Regenerated');
        } else {
          this.notifier.notify('success', 'Report Successfully Generated');
        }
        return 'Regenerate';
      } else if (res.StatusCode == 200 && res.Message == 'Failed') {
        if (buttonText == 'Regenerate'){
          this.notifier.notify('error', 'Failed to Regenerate Report');
        } else {
          this.notifier.notify('error', 'Failed to Generate Report');
        }
        return 'Generate';
      } else {
        this.notifier.notify('error', 'Something Went Wrong');
        return 'Generate';
      }
    } catch (e) {
      return 'Generate';
    }
  }

  async isReportAvailable(categoryId, categoryName, serviceType: ServiceType, reportType, dateRange: DateRange) {
    try {
      let res = await this.httpService.get(this.configs.endPoints['is-report-available'], {
        categoryId,
        categoryName,
        serviceType,
        from: this.datePipe.transform(dateRange.start, 'yyyy/MM/dd'),
        to: this.datePipe.transform(dateRange.end, 'yyyy/MM/dd'),
        reportType
      }).toPromise();
      if (res.StatusCode == 200 && res.Message == 'Success') {
        return 'Regenerate';
      } else if (res.StatusCode == 200 && res.Message == 'Failed') {
        return 'Generate';
      } else {
        return 'Generate';
      }
    } catch (e) {
      return 'Generate';
    }
  }

  async downloadAsExcel(categoryId, categoryName, serviceType: ServiceType, reportType, dateRange: DateRange) {
    try {
      let url = buildPlaceholder(`${this.initialService.getHost()}/${this.configs.endPoints['download-as-excel']}`, { 
        categoryId,
        categoryName,
        serviceType,
        from: this.datePipe.transform(dateRange.start, 'yyyy/MM/dd'),
        to: this.datePipe.transform(dateRange.end, 'yyyy/MM/dd'),
        reportType
      });

      let newTab;
      this.isReportAvailable(categoryId, categoryName, serviceType, reportType, dateRange).then(res => {
        if (res == 'Regenerate') {
          newTab = window.open(url);
          this.notifier.notify('success', 'Report Successfully Downloaded');
        } else {
          this.notifier.notify('error', 'Failed to Download Report');
        }
      });
    } catch (e) {
      this.notifier.notify('error', 'Something Went Wrong');
    }
  }

  async getSchedules(serviceType: ServiceType, locationType) {
    try {
      let scheduleData = [];
      let res = await this.httpService.get(this.configs.endPoints['get-schedules'], {
        serviceType,
        locationType
      }).toPromise();
      if (res[0] && res[0].scheduleId) {
        res.forEach(element => {
          scheduleData.push({
            id: element.scheduleId,
            scheduleName: element.name,
            reportType: element.reportType,
            site: element.scheduleAttributes.siteId ? {
              id: element.scheduleAttributes.siteId,
              name: this.initialService.navigationStore.getSiteNameBySiteId(Number(element.scheduleAttributes.siteId))[0].siteName
            } : {id: null, name: ''},
            buildingGroup: element.scheduleAttributes.buildingGroupId ? {
              id: element.scheduleAttributes.buildingGroupId,
              name: this.initialService.navigationStore.getBuildingGroupById(Number(element.scheduleAttributes.buildingGroupId))[0] ?
this.initialService.navigationStore.getBuildingGroupById(Number(element.scheduleAttributes.buildingGroupId))[0].description : 'N/A'
            } : {id: null, name: ''},
            building: element.scheduleAttributes.buildingId ? {
              id: element.scheduleAttributes.buildingId,
              name: this.initialService.navigationStore.getBuilding(Number(element.scheduleAttributes.buildingId))[0].buildingName
            } : {id: null, name: ''},
            startDate: element.startDate.substr(0, 10),
            status: element.status == 1 ? 'ACTIVE' : 'INACTIVE',
          });
        });
      }
      return scheduleData;
    } catch (e) {
      return [];
    }
  }

  async insertSchedule(schedule) {
    try {
      let res: any = await this.httpService.post(this.configs.endPoints['insert-schedule'], schedule, {}).toPromise();
      if (res.StatusCode == 200 && res.Message == 'Success') {
        this.notifier.notify('success', 'Schedule Successfully Added');
      } else if (res.StatusCode == 200 && res.Message == 'Failed') {
        this.notifier.notify('error', 'Failed to Add the Schedule');
      } else if (res.StatusCode == 467) {
        this.notifier.notify('warning', 'Schedule is Already Exists');
      } else {
        this.notifier.notify('error', 'Something Went Wrong');
      }
    } catch (e) { }
  }

  async editSchedule(scheduleId, schedule) {
    try {
      let res: any = await this.httpService.put(this.configs.endPoints['edit-schedule'], { scheduleId }, schedule).toPromise();
      if (res.StatusCode == 200 && res.Message == 'Success') {
        this.notifier.notify('success', 'Schedule Successfully Edited');
      } else if (res.StatusCode == 200 && res.Message == 'Failed') {
        this.notifier.notify('error', 'Failed to Edit the Schedule');
      } else if (res.StatusCode == 467) {
        this.notifier.notify('warning', 'Schedule is Already Exists');
      } else {
        this.notifier.notify('error', 'Something Went Wrong');
      }
    } catch (e) { }
  }

  async deleteSchedule(scheduleId) {
    try {
      let res: any = await this.httpService.delete(this.configs.endPoints['delete-schedule'], {scheduleId}).toPromise();
      if (res.StatusCode == 200 && res.Message == 'Success') {
        this.notifier.notify('success', 'Schedule Successfully Deleted');
      } else if (res.StatusCode == 200 && res.Message == 'Failed') {
        this.notifier.notify('error', 'Failed to Delete the Schedule');
      } else {
        this.notifier.notify('error', 'Something Went Wrong');
      }
    } catch (e) { }
  }
}
