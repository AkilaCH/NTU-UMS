import { EquipmentBreakdownStoreService } from './../store/equipment-breakdown-store.service';
import { NavigationService } from './../store/navigation.service';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import siteConfigurations from 'src/assets/configs/site-configs.json';
import { Building } from '../models/building';
import { BuildingGroup } from '../models/buildingGroup';
import { BuildingCategory } from '../models/buildingCategory';
import { HTLoop } from '../models/htLoop';
import { Level } from '../models/level';
import { Site } from '../models/site';
import { Plant } from '../models/plant';
import { SubStation } from '../models/subStation';
import { MeterTypes } from '../models/meterTypes';
import { AppSetting } from '../models/interface/app-setting';
import { Config } from '../models/interface/config';
import { forkJoin, Observable } from 'rxjs';
import { SiteConfig } from '../models/interface/site-config';

@Injectable({
  providedIn: 'root'
})

export class InitialService {

  config: AppSetting = null;

  env: Config = null;

  endPoints: any = [];

  siteConfigurations: SiteConfig = null;

  chartConfigurations: any = [];

  private greenmarkData: any;

  store = {
    navigation: null
  }

  constructor(
    private http: HttpClient,
    public navigationStore: NavigationService,
    public equipmentBreakdownStoreService: EquipmentBreakdownStoreService,
  ) {
    this.store.navigation = this.navigationStore;
  }

  load() {
    return new Promise((resolve, reject) => {
      this.http.get('../assets/configs/appConfigs.json').subscribe((resEnv: Config) => {
          this.env = resEnv;
          switch(this.env.mode) {
              case "production": {
                  this.getConfigs('../assets/configs/appConfigsProd.json').subscribe((resConfig: AppSetting) => {
                    this.setConfig(resConfig);
                    resolve(true);
                  });
                  break;
              }
              case "development": {
                  this.getConfigs('../assets/configs/appConfigsDev.json').subscribe((resConfig: AppSetting) => {
                    this.setConfig(resConfig);
                    resolve(true);
                  });
                  break;
              }
              default: {
                resolve(true);
                break;
              }
          }
      }, error => {
          console.log('Error while reading configurations:', error);
          reject(true);
      });
    });
  }

  setConfig(resConfig: AppSetting) {
    this.config = resConfig[0];
    this.endPoints = resConfig[1];
    this.siteConfigurations = resConfig[2];
    this.chartConfigurations = resConfig[3];

    this.startBootstrap();
  }

  getConfigs(url: string): Observable<any> {
    const configs = this.http.get(url);
    const endPoints = this.http.get('../assets/configs/end-points.json');
    const siteConfigs = this.http.get('../assets/configs/site-configs.json');
    const chartConfigs = this.http.get('../assets/configs/chart-configs.json');

    return forkJoin([configs, endPoints, siteConfigs, chartConfigs]);
  }

  loadGreenmarkConfigs() {
    try {
      this.http.get('../assets/configs/greenmarkConfigs.json')
      .subscribe(config => {
        this.greenmarkData = config;
      });
    } catch( e) {
    }
  }

  getGreenmarkData(): any {
    return this.greenmarkData;
  }

  startBootstrap() {
    this.getAllSites();
    this.loadGreenmarkConfigs();
    this.getAllBuildings();
    this.getAllBuildingCategories();
    this.getSiteName();
    this.getAllBuildingGroups();
    this.getAllMeterTypes();
    this.getAllHtLoops();
    this.getAllSubstations();
    this.getAllChillers();
    this.getAllLevels();
  }

  getHost(): string {
    return this.config.api_host;
  }

  isUnderMaintenece(){
    return this.config.maintenences.enabled;
  }

  getMaintainDueDate(){
    return this.config.maintenences.date;
  }

  getDemoConfig(): any {
    return {
      isDemo: this.config ? this.config.demo : true,
      demoDate: this.config ? this.config.demoDate : new Date(),
    };
  }

  getGreemarkConfigs(): any {
    return 
  }

  getVersion(): any {
    return this.config.version;
  }

  private getAllSites() {
    this.http.get(this.evalTemplateLiterals(`${this.config.api_host}/${this.endPoints.sites}`, {})).subscribe((res: Site[]) => {
      this.navigationStore.sites = res;
    });
  }

  private getAllMeterTypes(){
    this.http.get(this.evalTemplateLiterals(`${this.config.api_host}/${this.endPoints["meter-types"]}`, {
      siteId: siteConfigurations.siteId
    })).subscribe((res: MeterTypes[])=>{
      this.navigationStore.meterTypes = res;
    });
  }

  private getAllLevels(){
    this.http.get(this.evalTemplateLiterals(`${this.config.api_host}/${this.endPoints["site-all-levels"]}`,{
      siteId: siteConfigurations.siteId
    })).subscribe((res: Level[])=>{
      this.navigationStore.levels = res;
    });
  }

  private getAllChillers() {
    this.http.get(this.evalTemplateLiterals(`${this.config.api_host}/${this.endPoints['site-all-chillers']}`, {
      siteId: siteConfigurations.siteId
    })).subscribe((res: Plant[])=>{
      this.navigationStore.plants= res;
    });
  }

  private getAllSubstations() {
    this.http.get(this.evalTemplateLiterals(`${this.config.api_host}/${this.endPoints["site-substations"]}`, {
      siteId: siteConfigurations.siteId
    })).subscribe((res: SubStation[])=>{
      this.navigationStore.subStations = res;
    });
  }

  private getAllHtLoops() {
    this.http.get(this.evalTemplateLiterals(`${this.config.api_host}/${this.endPoints["ht-loops"]}`, {
      siteId: siteConfigurations.siteId
    })).subscribe((res: HTLoop[])=>{
      this.navigationStore.htLoops = res;
    });
  }

  private getAllBuildings(){
    this.http.get(this.evalTemplateLiterals(`${this.config.api_host}/${this.endPoints["site-all-buildings"]}`, {
      siteId: siteConfigurations.siteId
    })).subscribe((res: Building[])=>{
      this.navigationStore.buildings = res;
    });
  }

  private getAllBuildingGroups() {
    this.http.get(this.evalTemplateLiterals(`${this.config.api_host}/${this.endPoints["site-all-building-groups"]}`, {
      siteId: siteConfigurations.siteId
    })).subscribe((res: BuildingGroup[])=>{
      this.navigationStore.buildingGroups = res;
    });
  }

  private getAllBuildingCategories() {
    this.http.get(this.evalTemplateLiterals(`${this.config.api_host}/${this.endPoints["site-categories"]}`, {
      siteId: siteConfigurations.siteId
    })).subscribe((res: BuildingCategory[])=>{
      this.navigationStore.buildingCategories = res;
    });
  }

  private getSiteName() {
    this.http.get(this.evalTemplateLiterals(`${this.config.api_host}/${this.endPoints.site}`, {
      siteId: siteConfigurations.siteId
    })).subscribe((res: Site[]) => {
      this.navigationStore.siteNameAndId = res;
    });
  }

  evalTemplateLiterals( string: string, params) {
    return Function(...Object.keys(params), 'return `' + string + '`')
      (...Object.values(params));
  }

}
