export class BuildingGroup {
  buildingGroupID: number;
  description: string;
  siteID: number;
  serviceTypes: Array<ServiceTypeItem>;
}

class ServiceTypeItem {
  description: string;
  serviceTypeID: number;
}
