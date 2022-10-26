import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ElectricalDashboardComponent } from './dashboards/electrical-dashboard/electrical-dashboard.component';
import { WaterDashboardComponent } from './dashboards/water-dashboard/water-dashboard.component';
import { SiteElectricalDashboardComponent } from './dashboards/site-electrical-dashboard/site-electrical-dashboard.component';
import { SiteWaterDashboardComponent } from './dashboards/site-water-dashboard/site-water-dashboard.component';
import { OverviewComponent } from './dashboards/overview/overview.component';
import { ChillerPlantComponent } from './dashboards/chiller-plant/chiller-plant.component';
import { ImageMapComponent } from './widgets/image-map/image-map.component';
import { ReportsComponent } from './widgets/reports/reports.component';
import { ElectricalGroupDashboardComponent } from './dashboards/electrical-group-dashboard/electrical-group-dashboard.component';
import { WaterGroupDashboardComponent } from './dashboards/water-group-dashboard/water-group-dashboard.component';
import { HtElectricalLoopDashboardComponent } from './dashboards/ht-electrical-loop-dashboard/ht-electrical-loop-dashboard.component';
import { AlertsDashboardComponent } from './dashboards/alerts-dashboard/alerts-dashboard.component';
import { HtElectricalSiteDashboardComponent } from './dashboards/ht-electrical-site-dashboard/ht-electrical-site-dashboard.component';
import { DashboardType } from 'src/enums/DashboardType';
import { CarbonFootprintComponent } from './dashboards/carbon-footprint/carbon-footprint.component';
import { ChillerEfficiencyComponent } from './dashboards/chiller-efficiency/chiller-efficiency.component';
import { CondenserPerformanceComponent} from './dashboards/condenser-performance/condenser-performance.component';
import { HeatBalanceComponent } from './dashboards/heat-balance/heat-balance.component';
import { ElectricalReportComponent } from './dashboards/electrical-report/electrical-report.component';
import { WaterReportComponent } from './dashboards/water-report/water-report.component';
import { ConfigurationsComponent } from './dashboards/configurations/configurations.component';
import { MaintainenceComponent } from './error_pages/maintainence/maintainence.component';
import { PowerMeterComponent } from './dashboards/power-meter/power-meter.component';

const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch : 'full' },
  { path: 'overview', component: OverviewComponent },
  {
    path: 'site-electrical',
    component: SiteElectricalDashboardComponent,
    data : {
      electricalType : DashboardType.LOW_TENSION
    }
  },
  {
    path: 'electrical-building-group/:id',
    component: ElectricalGroupDashboardComponent,
    data : {
      electricalType : DashboardType.LOW_TENSION
    }
  },
  { path: 'water-building-group/:id', component: WaterGroupDashboardComponent },
  { path: 'site-water', component: SiteWaterDashboardComponent },
  { path: 'electrical/:id', component: ElectricalDashboardComponent },
  { path: 'water/:id', component: WaterDashboardComponent },
  { path: 'plant', component: ChillerPlantComponent},
  { path: 'map/:type/:building', component: ImageMapComponent },
  { path: 'reports', component: ReportsComponent},
  { path: 'alerts', component: AlertsDashboardComponent},
  { path: 'maintenence', component: MaintainenceComponent},
  {
    path: 'ht-electrical-loop/:id',
    component: HtElectricalLoopDashboardComponent,
    data : {
      electricalType : DashboardType.HIGH_TENSION,
    }
  },
  { path: 'alerts', component: AlertsDashboardComponent},
  {
    path: 'ht-site-electrical',
    component: HtElectricalSiteDashboardComponent,
    data : {
      electricalType : DashboardType.HIGH_TENSION,
    }
  },
  { path: 'heat-balance', component: HeatBalanceComponent },
  { path: 'carbon-footprint', component: CarbonFootprintComponent },
  { path: 'chiller-efficiency', component: ChillerEfficiencyComponent },
  { path: 'condenser-performance', component: CondenserPerformanceComponent },
  { path: 'electrical-report', component: ElectricalReportComponent },
  { path: 'water-report', component: WaterReportComponent },
  { path: 'configurations', component: ConfigurationsComponent },
  { path: 'water-report', component: WaterReportComponent },
  { path: 'power-meter', component: PowerMeterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
