import { ServiceType } from './../../enums/ServiceType';
import { DashboardLevel } from 'src/enums/DashboardLevel';
import { DateRange } from './../widgets/date-range-picker/lib/models/date-range';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipmentBreakdownStoreService {
  private readonly _breakdownData = new BehaviorSubject<any>([]);
  readonly breakdownData$ = this._breakdownData.asObservable();

  private readonly _isLoading = new BehaviorSubject<boolean>(true);
  readonly isLoading$ = this._isLoading.asObservable();

  private readonly _dateRange = new BehaviorSubject<DateRange>(null);
  readonly dateRange$ = this._dateRange.asObservable();

  private readonly _level = new BehaviorSubject<string>(null);
  readonly level$ = this._level.asObservable();

  private readonly _equipmentType = new BehaviorSubject<string>(null);
  readonly equipmentType$ = this._equipmentType.asObservable();

  private readonly _equipmentCode = new BehaviorSubject<string>(null);
  readonly equipmentCode$ = this._equipmentCode.asObservable();

  private readonly _block = new BehaviorSubject<string>(null);
  readonly block$ = this._block.asObservable();

  private readonly _dashboardLevel = new BehaviorSubject<DashboardLevel>(null);
  readonly dashboardLevel$ = this._block.asObservable();

  private readonly _dashboardType = new BehaviorSubject<ServiceType>(null);
  readonly dashboardType$ = this._block.asObservable();

  constructor() { }

  get breakdownData(): any[] {
    return this._breakdownData.getValue();
  }

  set breakdownData(val: any[]){
    this._breakdownData.next(val);
  }

  get isLoading(): boolean {
    return this._isLoading.getValue();
  }

  set isLoading(val: boolean){
    this._isLoading.next(val);
  }

  get dateRange(): DateRange {
    return this._dateRange.getValue();
  }

  set dateRange(val: DateRange){
    this._dateRange.next(val);
  }

  get level(): string {
    return this._level.getValue();
  }

  set level(val: string){
    this._level.next(val);
  }

  get equipmentType(): string {
    return this._equipmentType.getValue();
  }

  set equipmentType(val: string){
    this._equipmentType.next(val);
  }

  get equipmentCode(): string {
    return this._equipmentCode.getValue();
  }

  set equipmentCode(val: string){
    this._equipmentCode.next(val);
  }

  get block(): string {
    return this._block.getValue();
  }

  set block(val: string){
    this._block.next(val);
  }

  get dashboardLevel(): DashboardLevel {
    return this._dashboardLevel.getValue();
  }

  set dashboardLevel(val: DashboardLevel){
    this._dashboardLevel.next(val);
  }

  get dashboardType(): ServiceType {
    return this._dashboardType.getValue();
  }

  set dashboardType(val: ServiceType){
    this._dashboardType.next(val);
  }
}
