import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BuildingLevelType } from '../../../enums/building-level-type.enum';
import { ReportType } from '../../../enums/report-type.enum';
import { InitialService } from 'src/app/services/initial.service';
import { DateRange } from '../date-range-picker/public-api';
import sortBy from 'lodash/sortBy';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss']
})
export class ReportFormComponent implements OnInit {

  form: FormGroup;

  showBuildingGroup: boolean;
  showBuilding: boolean;
  showMonth: boolean;
  showDate: boolean;

  years = [];
  months = [];
  dates = [];

  sites = [];
  buildingGroups = [];
  buildings = [];
  selectedBuildingGroup: any;
  selectedBuilding: any;
  selectedType: BuildingLevelType;
  selectedReportType: ReportType;
  tariffReportType: ReportType = ReportType.Monthly;

  @Input() serviceType;
  @Input() isLoading;
  @Input() buttonText;
  @Output() reGenerate = new EventEmitter();
  @Output() download = new EventEmitter();
  @Output() initialData = new EventEmitter();

  constructor(private fb: FormBuilder, private datePipe: DatePipe, private initialService: InitialService) {
    this.showBuildingGroup = false;
    this.showBuilding = false;
    this.showMonth = false;
    this.showDate = false;
  }

  ngOnInit() {
    this.selectedType = BuildingLevelType.SITE;
    this.selectedReportType = ReportType.Yearly;
    this.getDates(1);
    this.getYears();
    this.getMonths();

    this.initialService.navigationStore.buildingGroups$.subscribe(() => {
      this.buildingGroups = this.initialService.navigationStore.buildingGroupsByServiceType(this.serviceType);
      this.buildingGroups = sortBy(this.buildingGroups, ['description']);
      this.selectedBuildingGroup = this.buildingGroups[0] ? this.buildingGroups[0].buildingGroupID : 1;

      this.initialService.navigationStore.buildings$.subscribe(() => {
        const buildingsList = this.initialService.navigationStore.getBuildingsByBuildingGroup(this.selectedBuildingGroup);
        this.buildings = buildingsList.filter(x => x.serviceTypes.some(y => y.serviceTypeID == this.serviceType));
        this.buildings = sortBy(this.buildings, ['buildingName']);
        this.selectedBuilding = this.buildings[0] ? this.buildings[0].buildingID : 1;

        this.form = this.fb.group({
          locationType: BuildingLevelType.SITE,
          location: this.fb.group({
            site: 1,
            buildingGroup: this.buildingGroups[0] ? this.buildingGroups[0].buildingGroupID : '',
            building: this.buildings[0] ? this.buildings[0].buildingID : ''
          }),
          reportType: `${ReportType.Yearly}`,
          dateTime: this.fb.group({
            year: 1,
            month: 1,
            date: 1
          })
        });

        this.isAvailableReport();
      });
    });
  }

  submitForm() {}

  onChangedLocation(event) {
    if (event.target.value == BuildingLevelType.SITE) {
      this.showBuildingGroup = false;
      this.showBuilding = false;
      this.selectedType = BuildingLevelType.SITE;
    } else if (event.target.value == BuildingLevelType.BUILDING_GROUP) {
      this.showBuildingGroup = true;
      this.showBuilding = false;
      this.selectedType = BuildingLevelType.BUILDING_GROUP;
    } else {
      this.showBuilding = true;
      this.showBuildingGroup = true;
      this.selectedType = BuildingLevelType.BUILDING;
    }
    this.isAvailableReport();
  }

  onChangedType(value) {
    if (value == ReportType.Yearly) {
      this.showMonth = false;
      this.showDate = false;
      this.selectedReportType = ReportType.Yearly;
    } else if (value == ReportType.Monthly) {
      this.showMonth = true;
      this.showDate = false;
      this.selectedReportType = ReportType.Monthly;
    } else {
      this.showMonth = true;
      this.showDate = true;
      this.selectedReportType = ReportType.None;
    }
    this.isAvailableReport();
  }

  getYears() {
    const yearList = [];
    for (let year = 0; year < 10; year++) {
      yearList.push({year: new Date().getFullYear() - year, value: year + 1});
    }
    this.years = yearList;
  }

  getMonths() {
    const monthList = [];
    for (let i = 0; i < 12; i++) {
      monthList.push({name: this.datePipe.transform(new Date(1).setMonth(i), 'MMMM'), value: i + 1});
      // console.log(this.datePipe.transform(new Date(1).setMonth(i),'MMMM'))
      //console.log(this.datePipe.transform(new Date().setMonth(i), 'MMMM') + 'date')
    }
    this.months = monthList;
  }

  getDates(month) {
    let noOfDate;
    const dateList = [];
    noOfDate = new Date(new Date().getFullYear(), month, 0).getDate();
    for (let date = 1; date <= noOfDate; date++) {
      dateList.push(date);
    }
    this.dates = dateList;
  }

  onChangeYear() {
    this.isAvailableReport();
  }

  onChangeMonth() {
    this.isAvailableReport();
  }

  onChangeDate() {
    this.isAvailableReport();
  }

  onChangedSite(e) {
    this.isAvailableReport();
  }

  onChangedGroup(e) {
    this.selectedBuildingGroup = parseInt(e);
    const buildingsList = this.initialService.navigationStore.getBuildingsByBuildingGroup(this.selectedBuildingGroup);
    this.buildings = buildingsList.filter(x => x.serviceTypes.some(y => y.serviceTypeID == this.serviceType));
    this.buildings = sortBy(this.buildings, ['buildingName']);
    this.selectedBuilding = this.buildings[0] ? this.buildings[0].buildingID : 1;
    this.form.patchValue({
      location: {
        building: this.selectedBuilding
      }
    });
    this.isAvailableReport();
  }

  onChangedBuilding(e) {
    this.selectedBuilding = parseInt(e);
    this.isAvailableReport();
  }

  currentFormData() {
    let categoryId;
    let year = this.years.find(x => x.value == this.form.value.dateTime.year).year;
    let month = this.months.find(x => x.value == this.form.value.dateTime.month).value - 1;
    let date = this.form.value.dateTime.date;
    let dateRange = new DateRange();
    dateRange.start = new Date(year, month, date);
    dateRange.end = new Date(year, month, date);

    switch (parseInt(this.form.value.locationType)) {
      case BuildingLevelType.SITE:
        categoryId = 1;
        break;

      case BuildingLevelType.BUILDING:
        categoryId = this.selectedBuilding;
        break;

      case BuildingLevelType.BUILDING_GROUP:
        categoryId = this.selectedBuildingGroup;
        break;
    }

    switch (parseInt(this.form.value.reportType)) {
      case ReportType.Yearly:
        dateRange.start.setMonth(0);
        dateRange.start.setDate(1);
        dateRange.end.setFullYear(dateRange.end.getFullYear() + 1);
        dateRange.end.setMonth(0);
        dateRange.end.setDate(1);
        break;

      case ReportType.Monthly:
        dateRange.start.setDate(1);
        dateRange.end.setMonth(dateRange.start.getMonth() + 1);
        dateRange.end.setDate(1);
        break;

      case ReportType.Daily:
        dateRange.end.setDate(dateRange.start.getDate() + 1);
        break;
    }

    return {
      categoryId,
      categoryName: parseInt(this.form.value.locationType),
      reportType: parseInt(this.form.value.reportType),
      dateRange
    };
  }

  isAvailableReport() {
    this.initialData.emit(this.currentFormData());
  }

  regenerate() {
    this.reGenerate.emit(this.currentFormData());
  }

  downloadAsExcel() {
    this.download.emit(this.currentFormData());
  }

}
