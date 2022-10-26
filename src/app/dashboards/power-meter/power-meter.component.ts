import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import * as meterDaily from '../../../assets/data/demo/meterDaily.json';
import * as meterMonthly from '../../../assets/data/demo/meterMonthly.json';

@Component({
  selector: 'app-power-meter',
  templateUrl: './power-meter.component.html',
  styleUrls: ['./power-meter.component.scss']
})
export class PowerMeterComponent implements OnInit {

  private pageName: string = 'Meter Report';

  //0 = daily, 1 = monthly, 2 = custom
  public reportType: number = null;

  //0 = electrical, 1 = water
  private serviceType: number = null;

  public meterDailySource: any;
  public meterMonthlySource: any;

  public meters: string[] = [
    'DB/SAMPLE 01',
    'DB/SAMPLE 02',
    'DB/SAMPLE 03',
    'DB/SAMPLE 04',
    'DB/SAMPLE 05',
    'DB/SAMPLE 06',
    'DB/SAMPLE 07',
    'DB/SAMPLE 08',
    'DB/SAMPLE 09',
    'DB/SAMPLE 10',
    'DB/SAMPLE 11',
    'DB/SAMPLE 12',
    'DB/SAMPLE 14',
    'DB/SAMPLE 15',
    'DB/SAMPLE 16',
    'DB/SAMPLE 17',
    'DB/SAMPLE 18',
    'DB/SAMPLE 19',
    'DB/SAMPLE 20',
    'DB/SAMPLE 21',
    'DB/SAMPLE 22'
  ];

  constructor(private headerService: HeaderService,) { }

  ngOnInit() {
    this.headerService.setItem(this.pageName);
    this.headerService.setBoardLevel(2);

    this.reportType = 0;
    this.serviceType = 0;
    // this.meterDailySource = meterDaily;
    this.meterDailySource = 
    {
      "chart": {
        "caption": "",
        "placeholder": "",
        "subCaption": "",
        "xAxisName": "Days of July, 2021",
        "yAxisName": "Consumption (kWh)",
        "baseFont": "Poppins",
        "loadMessage": "",
        "canvasBaseColor": "#ffffff",
        "canvasBaseDepth": 4,
        "showCanvasBg": false,
        "baseFontColor": "#ffffff",
        "baseFontSize": 14,
        "theme": "carbon",
        "xAxisNameFontColor": "#ffffff",
        "xAxisNameFontSize": 14,
        "xAxisNameFontBold": false,
        "yAxisNameFontColor": "#ffffff",
        "yAxisNameFontSize": 14,
        "yAxisNameFontBold": false,
        "palettecolors": "#007bff,#29c3be",
        "use3DLighting": 0,
        "bgColor": "#293946",
        "bgAlpha": 100,
        "exportenabled": 1,
        "exportformats": "JPG=Export as Image|PDF=Export as PDF",
        "exportFileName": "Change In Energy Consumption",
        "toolbarButtonColor": "#455f73",
        "toolbarButtonScale": 1.5
      },
      "categories": [
          {
              "category": [
                  {
                      "label": "1"
                  },
                  {
                      "label": "2"
                  },
                  {
                      "label": "3"
                  },
                  {
                      "label": "4"
                  },
                  {
                      "label": "5"
                  },
                  {
                      "label": "6"
                  },
                  {
                      "label": "7"
                  },
                  {
                      "label": "8"
                  },
                  {
                      "label": "9"
                  },
                  {
                      "label": "10"
                  },
                  {
                      "label": "11"
                  },
                  {
                      "label": "12"
                  },
                  {
                      "label": "13"
                  },
                  {
                      "label": "14"
                  },
                  {
                      "label": "15"
                  },
                  {
                      "label": "16"
                  },
                  {
                      "label": "17"
                  },
                  {
                      "label": "18"
                  },
                  {
                      "label": "19"
                  },
                  {
                      "label": "20"
                  },
                  {
                      "label": "21"
                  },
                  {
                      "label": "22"
                  },
                  {
                      "label": "23"
                  },
                  {
                      "label": "24"
                  },
                  {
                      "label": "25"
                  },
                  {
                      "label": "26"
                  },
                  {
                      "label": "27"
                  },
                  {
                      "label": "28"
                  },
                  {
                      "label": "29"
                  },
                  {
                      "label": "30"
                  },
                  {
                      "label": "31"
                  }
              ]
          }
      ],
      "dataset": [
          {
              "seriesname": "DB/SAMPLE 02",
              "data": [
                  {
                      "value": "100"
                  },
                  {
                      "value": "115"
                  },
                  {
                      "value": "125"
                  },
                  {
                      "value": "150"
                  },
                  {
                      "value": "100"
                  },
                  {
                      "value": "115"
                  },
                  {
                      "value": "125"
                  },
                  {
                      "value": "150"
                  },
                  {
                    "value": "100"
                  },
                  {
                      "value": "115"
                  },
                  {
                      "value": "125"
                  },
                  {
                      "value": "150"
                  },
                  {
                      "value": "100"
                  },
                  {
                      "value": "115"
                  },
                  {
                      "value": "125"
                  },
                  {
                      "value": "150"
                  },
                  {
                    "value": "100"
                  },
                  {
                      "value": "115"
                  },
                  {
                      "value": "125"
                  },
                  {
                      "value": "150"
                  },
                  {
                      "value": "100"
                  },
                  {
                      "value": "115"
                  },
                  {
                      "value": "125"
                  },
                  {
                      "value": "150"
                  },
                  {
                      "value": "125"
                  },
                  {
                      "value": "150"
                  },
                  {
                      "value": "100"
                  },
                  {
                      "value": "115"
                  },
                  {
                      "value": "125"
                  },
                  {
                      "value": "150"
                  },
                  {
                      "value": "150"
                  }
              ]
          },
          {
              "seriesname": "DB/SAMPLE 03",
              "data": [
                  {
                      "value": "220"
                  },
                  {
                      "value": "215"
                  },
                  {
                      "value": "105"
                  },
                  {
                      "value": "190"
                  },
                  {
                    "value": "220"
                  },
                  {
                      "value": "215"
                  },
                  {
                      "value": "105"
                  },
                  {
                      "value": "190"
                  },
                  {
                    "value": "220"
                  },
                  {
                      "value": "215"
                  },
                  {
                      "value": "105"
                  },
                  {
                      "value": "190"
                  },
                  {
                    "value": "220"
                  },
                  {
                      "value": "215"
                  },
                  {
                      "value": "105"
                  },
                  {
                      "value": "190"
                  },
                  {
                      "value": "190"
                  },
                  {
                    "value": "220"
                  },
                  {
                      "value": "215"
                  },
                  {
                      "value": "105"
                  },
                  {
                      "value": "190"
                  },
                  {
                    "value": "220"
                  },
                  {
                      "value": "215"
                  },
                  {
                      "value": "105"
                  },
                  {
                      "value": "190"
                  },
                  {
                    "value": "220"
                  },
                  {
                      "value": "215"
                  },
                  {
                      "value": "105"
                  },
                  {
                      "value": "190"
                  },
                  {
                      "value": "190"
                  },
                  {
                      "value": "105"
                  }
              ]
          }
      ]
    }
    
    this.reportType = 1;
    this.serviceType = 1;
    // this.meterMonthlySource = meterMonthly;
    this.meterMonthlySource = 
    {
      "chart": {
        "caption": "",
        "placeholder": "",
        "subCaption": "",
        "xAxisName": "Months of 2021",
        "yAxisName": "Consumption (kWh)",
        "baseFont": "Poppins",
        "loadMessage": "",
        "canvasBaseColor": "#ffffff",
        "canvasBaseDepth": 4,
        "showCanvasBg": false,
        "baseFontColor": "#ffffff",
        "baseFontSize": 14,
        "theme": "carbon",
        "xAxisNameFontColor": "#ffffff",
        "xAxisNameFontSize": 14,
        "xAxisNameFontBold": false,
        "yAxisNameFontColor": "#ffffff",
        "yAxisNameFontSize": 14,
        "yAxisNameFontBold": false,
        "palettecolors": "#007bff,#29c3be",
        "use3DLighting": 0,
        "bgColor": "#293946",
        "bgAlpha": 100,
        "exportenabled": 1,
        "exportformats": "JPG=Export as Image|PDF=Export as PDF",
        "exportFileName": "Change In Energy Consumption",
        "toolbarButtonColor": "#455f73",
        "toolbarButtonScale": 1.5
      },
      "categories": [
          {
              "category": [
                  {
                      "label": "January"
                  },
                  {
                      "label": "February"
                  },
                  {
                      "label": "March"
                  },
                  {
                      "label": "April"
                  },
                  {
                      "label": "May"
                  },
                  {
                      "label": "June"
                  },
                  {
                      "label": "July"
                  },
                  {
                      "label": "August"
                  },
                  {
                      "label": "September"
                  },
                  {
                      "label": "October"
                  },
                  {
                      "label": "November"
                  },
                  {
                      "label": "December"
                  }
                  
              ]
          }
      ],
      "dataset": [
          {
              "seriesname": "DB/SAMPLE 02",
              "data": [
                  {
                      "value": "100"
                  },
                  {
                      "value": "115"
                  },
                  {
                      "value": "125"
                  },
                  {
                      "value": "150"
                  },
                  {
                      "value": "100"
                  },
                  {
                      "value": "115"
                  },
                  {
                      "value": "125"
                  }
                  
              ]
          },
          {
              "seriesname": "DB/SAMPLE 03",
              "data": [
                  {
                      "value": "220"
                  },
                  {
                      "value": "215"
                  },
                  {
                      "value": "105"
                  },
                  {
                      "value": "190"
                  },
                  {
                    "value": "220"
                  },
                  {
                      "value": "215"
                  },
                  {
                      "value": "105"
                  }
                  
                  
              ]
          }
      ]
    }
    
  }

  setReportType(value: number): void {
    this.reportType = value;
  }

  setServiceType(value: number): void {
    this.serviceType = value;
  }

  isChecked(index: number): boolean {
    const items = [1,2];
    return items.includes(index);
  }
}
