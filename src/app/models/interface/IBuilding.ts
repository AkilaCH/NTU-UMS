import {IMeter} from './IMeter';

export interface IBuilding {
  buildingID: number;
  buildingName: string;
  consumption: number;
  meters: IMeter[];
}
