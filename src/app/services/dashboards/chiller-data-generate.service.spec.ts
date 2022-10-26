import { TestBed, getTestBed } from '@angular/core/testing';
import chartconfigurations from 'src/assets/configs/chart-configs.json';

import { ChillerDataGenerateService } from './chiller-data-generate.service';

describe('ChillerDataGenerateService', () => {
  let injector: TestBed;
  let service: ChillerDataGenerateService;
  const configs = chartconfigurations;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChillerDataGenerateService],
    });

    injector = getTestBed();
    service = injector.get(ChillerDataGenerateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const chillerEfficiencyChartData = {
    chart: configs.chillerEfficiency.chart,
    categories: [
      {
        category: ''
      },
    ],
    dataset: [
      {
        seriesname: configs.chillerEfficiency.dataset[0].seriesname,
        color: configs.chillerEfficiency.dataset[0].color,
        data: ''
      },
    ],
    trendlines: configs.chillerEfficiency.trendlines,
  };

  const carbonFootprintChartData = {
    chart: configs.carbonFootprint.chart,
    categories: [
      {
        category: ''
      },
    ],
    dataset: [
      {
        seriesname: configs.carbonFootprint.dataset[0].seriesname,
        color: configs.carbonFootprint.dataset[0].color,
        data: ''
      },
      {
        seriesname: configs.carbonFootprint.dataset[1].seriesname,
        color: configs.carbonFootprint.dataset[1].color,
        parentYAxis: configs.carbonFootprint.dataset[1].parentYAxis,
        data: ''
      },
      {
        seriesname: configs.carbonFootprint.dataset[2].seriesname,
        color: configs.carbonFootprint.dataset[2].color,
        data: "",
      },
    ],
  };

  const xyData = [
    { x: 1, y: null },
    { x: 2, y: null },
    { x: 3, y: null },
    { x: 4, y: null },
    { x: 5, y: null },
    { x: 6, y: null },
    { x: 7, y: null },
    { x: 8, y: null },
    { x: 9, y: null },
    { x: 10, y: null },
    { x: 11, y: null },
    { x: 12, y: null },
    { x: 13, y: null },
    { x: 14, y: null },
    { x: 15, y: null },
    { x: 16, y: null },
    { x: 17, y: null },
    { x: 18, y: null },
    { x: 19, y: null },
    { x: 20, y: null },
    { x: 21, y: null },
    { x: 22, y: null },
    { x: 23, y: null },
    { x: 24, y: null },
    { x: 25, y: null },
    { x: 26, y: null },
    { x: 27, y: null },
    { x: 28, y: null },
    { x: 29, y: null },
    { x: 30, y: null },
    { x: 31, y: null },
    { x: 32, y: null },
    { x: 33, y: null },
    { x: 34, y: null },
    { x: 35, y: null }
  ];

  const condenserPerformanceChartData = {
    chart: configs.condenserPerformance.chart,
    dataset: [
      {
        seriesname: configs.condenserPerformance.dataset[0].seriesname,
        color: configs.condenserPerformance.dataset[0].color,
        anchorsides: configs.condenserPerformance.dataset[0].anchorsides,
        anchorradius: configs.condenserPerformance.dataset[0].anchorradius,
        anchorbgcolor: configs.condenserPerformance.dataset[0].anchorbgcolor,
        anchorbordercolor:
          configs.condenserPerformance.dataset[0].anchorbordercolor,
        data: xyData,
      },
      {
        seriesname: configs.condenserPerformance.dataset[1].seriesname,
        color: configs.condenserPerformance.dataset[1].color,
        anchorsides: configs.condenserPerformance.dataset[1].anchorsides,
        anchorradius: configs.condenserPerformance.dataset[1].anchorradius,
        anchorbgcolor: configs.condenserPerformance.dataset[1].anchorbgcolor,
        anchorbordercolor:
          configs.condenserPerformance.dataset[1].anchorbordercolor,
        data: xyData,
      },
    ],
  };

  // it('generateChillerEfficiencyChart() should return data', () => {
  //   let res = service.generateChillerEfficiencyChart([]);
  //   expect(res).toEqual(chillerEfficiencyChartData);
  // });

  // it('generateCarbonFootprintChart() should return data', () => {
  //   let res = service.generateCarbonFootprintChart([]);
  //   expect(res).toEqual(carbonFootprintChartData);
  // });

  // it('generateCondenserPerformanceChart should return data', () => {
  //   let res = service.generateCondenserPerformanceChart([]);
  //   expect(res).toEqual(condenserPerformanceChartData);
  // });
});
