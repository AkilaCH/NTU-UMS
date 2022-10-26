import { Component, OnInit } from '@angular/core';
import { JsLoader } from '../../../util/jsLoader';

declare function DrawLinearScaleGradient(): any;
@Component({
  selector: 'app-linear-scale-gradient',
  templateUrl: './linear-scale-gradient.component.html',
  styleUrls: ['./linear-scale-gradient.component.scss'],
  host: {'class': 'w-100'}
})

export class LinearScaleGradientComponent implements OnInit {

  constructor() {
    JsLoader.loadScript();
    this.updateChart();
  }

  ngOnInit() {
  }

  updateChart() {
    setTimeout(() => {
      DrawLinearScaleGradient();
    }, 1000);
  }

}
