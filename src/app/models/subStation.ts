import { Attribute } from '@angular/core';

export class SubStation {
  subStationID: number;
  subStationName: string;
  subStationCode: string;
  htLoopID: number;
  attributes: Array<Attribute>;
}
