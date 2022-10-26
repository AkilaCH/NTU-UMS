import { BuildingLevelType } from "src/enums/building-level-type.enum";

export interface Tariff {
    type: BuildingLevelType;
    siteId: number;
    buildingGroupId: number;
    buildingId: number;
    rate: number;
}