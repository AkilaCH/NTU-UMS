export class Building {
  buildingName: string;
  buildingID: number;
  buildingCategoryID: number;
  buildingGroupID: number;
  serviceTypes: Array<ServiceTypeItem>;
}

class ServiceTypeItem {
  description: string;
  serviceTypeID: number;
}
