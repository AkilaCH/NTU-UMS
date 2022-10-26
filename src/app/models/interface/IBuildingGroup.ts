import {IBuilding} from './IBuilding';

export interface IBuildingGroup {
  buildingGroupID: number;
  description: string;
  consumption: number;
  buildings: IBuilding[];
}
