import { Attribute } from '@angular/core';

export class MeterTypes {
  meterTypeID: number;
  description: string;
  serviceTypeID: number;
  attributes: Array<Attribute>;
}
