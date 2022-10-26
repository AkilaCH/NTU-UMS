import { Component, Input,OnInit } from '@angular/core';

@Component({
  selector: 'app-consumption-summery-chart',
  templateUrl: './consumption-summery-chart.component.html',
  styleUrls: ['./consumption-summery-chart.component.scss']
})
export class ConsumptionSummeryChartComponent implements OnInit {
  @Input() type: string = "msline";
  @Input() dataSource: any = {};

  constructor() { }

  ngOnInit() {
    this.dataSource = {
      chart: {
        baseFont: "Poppins",
        baseFontColor: "#ffffff",
        baseFontSize: 14,
        bgAlpha: 100,
        bgColor: "#293946",
        canvasBgAlpha: 0,
        canvasBgColor: "#ffffff",
        caption: "",
        formatNumberScale: 1,
        loadMessage: "",
        maxColWidth: 64,
        placeholder: "",
        plotToolText: "Day: $label{br}Consumption: $value kWh",
        subCaption: "",
        theme: "carbon",
        xAxisName: "Day",
        xAxisNameFontBold: false,
        xAxisNameFontColor: "#ffffff",
        xAxisNameFontSize: 14,
        yAxisName: "Consumption (kWh)",
        yAxisNameFontBold: false,
        yAxisNameFontColor: "#ffffff",
        yAxisNameFontSize: 14,
        palettecolors: "#b30000, #7c1158, #4421af, #1a53ff, #0d88e6, #00b7c7, #5ad45a, #8be04e, #ebdc78",
        valuefontSize: 16
        
      },
      caption: {
        text: 'Daily Visitors Count of a Website'
      },
      yAxis: [
        {
          plot: {
            value: 'Consumption',
            type: 'area'
          },
          title: 'Daily Visitors (in thousand)'
        }
      ],
      categories: [{ category: [] }],
      dataSet: []
    };
  }

  reset(): void {
    this.setData([], [],'');
  }

  setData(labels: string[], data: Object[], colors: any): void {
    this.dataSource['categories'][0].category = labels;
    this.dataSource['dataSet'] = data;
    this.dataSource['chart'].palettecolors = colors;
  }

}
