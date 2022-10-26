import { BuildingGroup } from 'src/app/models/buildingGroup';
import orderBy from 'lodash/orderBy';
import { Level } from 'src/app/models/level';
import { Location } from 'src/app/models/location.model';
import { Building } from 'src/app/models/building';
import { HTLoop } from 'src/app/models/htLoop';
import { EquipmentType } from 'src/app/models/equipment-type.model';
import { Plant } from 'src/app/models/plant';
import { MeterTypes } from 'src/app/models/meterTypes';
import { SubStation } from 'src/app/models/subStation';

/**
 * Gets building group list
 * @param res
 */
export const getBuildingGroupList = (res: BuildingGroup[]) => {
    let buildingGroups = [];
    for (const item of res) {
      buildingGroups.push({
        name: item.description,
        id: item.buildingGroupID,
      });
    }
    return orderBy(buildingGroups, ['name'], ['asc']);
  };

/**
 * Gets building list
 * @param res
 */
export const getBuildingList = (res: Building[]) => {
    let buildings = [];
    for (const item of res) {
      buildings.push({
        name: item.buildingName,
        id: item.buildingID
      });
    }
    return orderBy(buildings, ['name'], ['asc']);
  };

/**
 * Gets level list
 * @param res
 */
export const getLevelList = (res: Level[]) => {
    let levels = [];
    for (const item of res) {
      levels.push({
        name: item.floorName,
        id: item.levelID
      });
    }
    return orderBy(levels, ['name'], ['asc']);
  };

/**
 * Get location list
 * @param res
 */
export const getLocationList = (res: Location[]) => {
  let locations = [];
  for (const item of res) {
    locations.push({
      name: item.locationName,
      id: item.locationID
    });
  }
  return orderBy(locations, ['name'], ['asc']);
};

/**
 * Get meterType List
 * @param res
 */
export const getMeterTypeList = (res: MeterTypes[]) => {
    let meterTypes = [];
    for (const item of res) {
      meterTypes.push(
      {
        name: item.description,
        id: item.meterTypeID
      }
      );
    }
    return orderBy(meterTypes, ['name'], ['asc']);
};

/**
 * Gets loop list
 * @param res
 */
export const getLoopList = (res: HTLoop[]) => {
    let loops = [];
    for (const item of res) {
     loops.push({
       name: item.htLoopName,
       id: item.htLoopID
     });
    }
    return orderBy(loops, ['name'], ['asc']);
};

/**
 * Gets plant list
 * @param res
 */
export const getPlantList = (res: Plant[]) => {
    let plants = [];
    for (const item of res) {
      plants.push({
        name: item.name,
        id: item.chillerPlantID,
        equipmentType: item.equipmentTypes
      });
    }
    return orderBy(plants, ['name'], ['asc']);
};

/**
 * Get equipment types
 * @param res
 */
export const getEquipmentTypeList = (res: EquipmentType[]) => {
    let equipmentTypes = [];
    for (const item of res) {
      equipmentTypes.push({
        name: item.name,
        id: item.equipmentTypeID
      });
    }
    return orderBy(equipmentTypes, ['name'], ['asc']);
};

/**
 * Gets substation list
 * @param res
 */
export const getSubstationList = (res: SubStation[]) => {
    let substations= [];
    for (const item of res) {
      substations.push({
        name: item.subStationName,
        id: item.subStationID
      });
    }
    return orderBy(substations, ['name'], ['asc']);
};
