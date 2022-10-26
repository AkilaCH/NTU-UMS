// import { BuildingCategories, Buildings } from './../../assets/mock/mock';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import { Building } from '../models/building';
import { BuildingGroup } from '../models/buildingGroup';
import { BuildingCategory } from '../models/buildingCategory';
import { HTLoop } from '../models/htLoop';
import NotificationItem from '../models/notification';
import { Level } from '../models/level';
import { Location } from '../models/location.model';
import { EquipmentType } from '../models/equipment-type.model';
// import { HeaderService } from '../services/header.service';
import { SubStation } from '../models/subStation';
import { MeterTypes } from '../models/meterTypes';
import { Plant } from '../models/plant';
import { Site } from '../models/site';
import { ServiceType } from 'src/enums/ServiceType';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly _buildings = new BehaviorSubject<Building[]>([]);
  private readonly _buildingCategories = new BehaviorSubject<BuildingCategory[]>([]);
  private readonly _htLoops = new BehaviorSubject<HTLoop[]>([]);
  private readonly _buildingNavigation = new BehaviorSubject<any>([]);
  private readonly _siteNameAndId = new BehaviorSubject<any>({});
  private readonly _sites = new BehaviorSubject<Site[]>([]);
  private readonly _buildingGroups = new BehaviorSubject<BuildingGroup[]>([]);
  private readonly _meterTypes = new BehaviorSubject<MeterTypes[]>([]);
  private readonly _subStations = new BehaviorSubject<SubStation[]>([]);
  private readonly _plants = new BehaviorSubject<Plant[]>([]);
  private readonly _notifications = new BehaviorSubject<NotificationItem[]>([]);
  private readonly _notificationsCount = new BehaviorSubject<any[]>([]);
  private readonly _levels = new BehaviorSubject<Level[]>([]);
  private readonly _locations = new BehaviorSubject<Location[]>([]);


  readonly buildingGroups$ = this._buildingGroups.asObservable();
  readonly buildings$ = this._buildings.asObservable();
  readonly buildingCategories$ = this._buildingCategories.asObservable();
  readonly htLoops$ = this._htLoops.asObservable();
  readonly buildingNavigation$ = this._buildingNavigation.asObservable();
  readonly siteNameAndId$ = this._siteNameAndId.asObservable();
  readonly sites$ = this._sites.asObservable();
  readonly meterTypes$ = this._meterTypes.asObservable();
  readonly subStations$ = this._subStations.asObservable();
  readonly plants$ = this._plants.asObservable();
  readonly notifications$ = this._notifications.asObservable();
  readonly notificationsCount$ = this._notificationsCount.asObservable();
  readonly levels$ = this._levels.asObservable();
  readonly locations$ = this._locations.asObservable();

  // constructor(private headerService:HeaderService) { }

  get sites(): Site[] {
    return this._sites.getValue();
  }

  get locations(): Location[] {
    return this._locations.getValue();
  }

  get buildings(): Building[] {
    return this._buildings.getValue();
  }

  get notificationsCount(): any[] {
    return this._notificationsCount.getValue();
  }

  get buildingCategories(): BuildingCategory[] {
    return this._buildingCategories.getValue();
  }

  get htLoops(): HTLoop[] {
    return this._htLoops.getValue();
  }

  get buildingNavigation(): any {
    return this._buildingNavigation;
  }

  get siteNameAndId(): any {
    return this.siteNameAndId;
  }

  get buildingGroups(): any {
    
    return this._buildingGroups.getValue();
  }

  set buildings(val: Building[]){
    this._buildings.next(val);
  }

  get meterTypes(): MeterTypes[] {
    return this._meterTypes.getValue();
  }

  set meterTypes(val: MeterTypes[]){
    this._meterTypes.next(val);
  }

  get subStations(): SubStation[] {
    return this._subStations.getValue();
  }

  get plants(): Plant[] {
    return this._plants.getValue();
  }

  set sites(val: Site[]) {
    this._sites.next(val);
  }

  set locations(val: Location[]) {
    this._locations.next(val);
  }

  get notifications(): NotificationItem[] {
    return this._notifications.getValue();
  }

  get levels(): Level[] {
    return this._levels.getValue();
  }

  set subStations(val: SubStation[]){
    this._subStations.next(val);
  }

  set levels(val: Level[]){
    this._levels.next(val);
  }

  set notificationsCount(val: any[]){
    this._notificationsCount.next(val);
  }

  set notifications(val: NotificationItem[]){
    this._notifications.next(val);
  }

  set buildingCategories(val: BuildingCategory[]){
    this._buildingCategories.next(val);
  }

  set htLoops(val: HTLoop[]){
    this._htLoops.next(val);
  }

  set buildingNavigation(val: any){
    this._buildingNavigation.next(val);
  }

  set siteNameAndId(val: any){
    this._siteNameAndId.next(val);
  }

  set buildingGroups(val: any) {
    this._buildingGroups.next(val);
  }

  set plants(val: Plant[]) {
    this._plants.next(val);
  }


  getBuildingsByCategory(categoryId: number) {
    return filter(this.buildings,{'buildingCategoryID': categoryId});
  }

  getAllNotifications() {
    return this.notifications;
  }

  removeNotification(notificationId) {
    let id = this.notifications.findIndex((item: NotificationItem)=>item.AlertTimeStamp==notificationId);
    this.notifications.splice(id, 1);
    this.notifications = [...this.notifications];

    let countId = this.notifications.findIndex((item: NotificationItem)=>item==notificationId);
    this.notificationsCount.splice(countId, 1);
    this.notificationsCount = [...this.notificationsCount];
  }

  removeNotificationCountItem(notificationId) {
    let countId = this.notificationsCount.findIndex((item)=>item==notificationId.toString());
    if(countId != -1){
      this.notificationsCount.splice(countId, 1);
      this.notificationsCount = [...this.notificationsCount];
    }
  }

  removeAllNotifiations() {
    this.notifications = [];
    this.notificationsCount = [];
  }

  isViewedNotification(notificationId){
    let countId = this.notificationsCount.findIndex((item)=>item==notificationId.toString());
    if(countId != -1){
      return false;
    } else {
      return true;
    }
  }

  removeOldestNotification() {
    this.notifications.splice(99, 1);
    this.notifications = [...this.notifications];
  }

  addNotification(notification:NotificationItem) {
    this.notifications.push(notification);
    this.notificationsCount.push(notification.AlertTimeStamp);
    this.notifications = [...this.notifications];
    this.notificationsCount = [...this.notificationsCount];
  }

  buildingGroupsByServiceType(serviceTypeId: ServiceType): any {
    return this._buildingGroups.getValue().filter(buildingGroup =>
      buildingGroup.serviceTypes.some(serviceType =>
        serviceType.serviceTypeID == serviceTypeId
        ));
  }

  buildingsByServiceType(serviceTypeId: ServiceType){
    return this._buildings.getValue().filter(building =>
      building.serviceTypes.some(serviceType =>
        serviceType.serviceTypeID == serviceTypeId
        ));
  }

  getBuildingCategoryById(categoryId: number) {
    return filter(this.buildingCategories,{'buildingCategoryID': categoryId});
  }

  getBuildingGroupById(groupId: number){
    return filter(this.buildingGroups, {'buildingGroupID': groupId});
  }

  getBuildingsByBuildingGroup(groupId: number) {
    return sortBy(filter(this.buildings, {buildingGroupID: groupId}), (o) => o.buildingName);
  }

  getSiteNameBySiteId(siteId: number) {
    return filter(this.sites, {siteID: siteId});
  }

  getLevelsByBuildingId(buildingId: number){
    return filter(this.levels, {'buildingID': buildingId});
  }

  getLevelById(levelId: number){
    return filter(this.levels, {'levelID': levelId});
  }

  getLocationByLevelId(levelId: number){
    return filter(this.locations, {'levelID': levelId});
  }

  getLocationById(locationId: number) {
    return filter(this.locations, {locationID: locationId});
  }

  getBuilding(buildingId: number){
    return filter(this.buildings,{'buildingID': buildingId});
  }

  getMeterTypeByServiceTypeId(serviceType: number) {
    return filter(this.meterTypes,{'serviceTypeID': serviceType});
  }

  getEquipmentTypeById(equipmentTypeId: number, plantId: number) {
    const equipmentTypes: EquipmentType[] = this.getPlantById(plantId)[0].equipmentTypes;
    return  filter(equipmentTypes, { equipmentTypeID: equipmentTypeId });
  }

  getMeterTypeById(meterTypeId: number) {
    return filter(this.meterTypes,{'meterTypeID': meterTypeId});
  }

  getLoopById(loopId: number) {
    return filter(this.htLoops,{'htLoopID': loopId});
  }

  getSubstationById(subStationId: number) {
    return filter(this.subStations,{'subStationID': subStationId});
  }

  getSubstationsByLoopId(loopId: number){
    return filter(this.subStations,{'htLoopID': loopId});
  }

  getPlantById(plantId: number) {
    return filter(this.plants,{'chillerPlantID': plantId});
  }


}
