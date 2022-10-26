import { ServiceType } from 'src/enums/ServiceType';

export function chartTitle(name, value, unit, percentage, mode, suffix: string = ''){
  if (value === null || value === 'null' || value === undefined){
    return null;
  } else {
    if (mode) {
      return `${percentage}`;
    } else {
      return `${name} - ${value}${suffix} ${unit} - ${percentage}`;
    }
  }
}

export function fixDecimalNumPrecision(value, places) {
  if (!isNaN(parseFloat(value)) && isFinite(value)) {
    if (Number.isInteger(value)) {
      return value;
    } else {
      return parseFloat(value).toFixed(places);
    }
  } else {
    return null;
  }
}

export function roundConsumptionValue(value: number, serviceTypeId: ServiceType) {
  if (value != null && value != undefined) {
    if (value < 1000) {
      if (serviceTypeId == ServiceType.WATER || serviceTypeId == ServiceType.MAIN_WATER) {
        return {
          value: fixDecimalNumPrecision(value, 2),
          unit: ' m³'
        };
      } else if(serviceTypeId == ServiceType.MAIN_INCOMER || serviceTypeId == ServiceType.ELECTRICAL){
        return {
          value,
          unit: ' kWh'
        };
      } else {
        return {
          value,
          unit: ' RTh'
      };
      }
    } else {
      if (serviceTypeId == ServiceType.WATER || serviceTypeId == ServiceType.MAIN_WATER) {
        return {
          value: fixDecimalNumPrecision(value/1000, 2),
          unit: 'K m³'
        };
      } else if(serviceTypeId == ServiceType.MAIN_INCOMER || serviceTypeId == ServiceType.ELECTRICAL){
        return {
          value:  fixDecimalNumPrecision(value/1000, 2),
          unit: ' MWh'
        };
      } else {
        return {
          value: fixDecimalNumPrecision(value/1000, 2),
          unit: 'K RTh'
        };
      }
    }
  } else {
    return {
      value: fixDecimalNumPrecision(value, 2),
      unit: null
    };
  }
}


interface AbbreviateNumber{
  suffix: string,
  scalledNumber: any,
  unit: string
}

export function abbreviateNumber(number: any, serviceTypeId: any = 1): AbbreviateNumber {
  const SUFFIX_LIST = ["", "k", "M", "G", "T", "P", "E"];
  let unit: string = 'RTh';
  if (serviceTypeId == ServiceType.WATER || serviceTypeId == ServiceType.MAIN_WATER) {
    unit = 'm³';
  } else if(serviceTypeId == ServiceType.MAIN_INCOMER || serviceTypeId == ServiceType.ELECTRICAL){
    unit = 'kWh';
  }

  if(isNaN(number) || !number || number == null) {
    return {
      suffix: null,
      scalledNumber: null,
      unit
    };
  } 
  // what tier? (determines SI symbol)
  const suffixIndex = Math.log10(Math.abs(number)) / 3 | 0;
  // get suffix and determine scale
  const suffix = SUFFIX_LIST[suffixIndex];
  const scale = Math.pow(10, suffixIndex * 3);
  let scaled = (number / scale).toFixed(3);
  // if zero, we don't need a suffix
  // if(suffixIndex == 0) scaled = number.toFixed(3);
  return {
    suffix: suffix,
    scalledNumber: scaled,
    unit
  }
}

interface GetChartMinMax{
  max: any,
  min: any
}

export function getChartMinMax(dataset: Array<any> = [], key: string = 'value'):GetChartMinMax {
  let min = 10000000000, max = 0;
  for (let i = 0; i < dataset.length; i++) {
    if(dataset[i]){
      const value = dataset[i][key] ||  dataset[i];
      if(value && Number(value) > max){
        max = Number(value)
      }
      if(value && Number(value) < min){
        min = Number(value)
      }
    }
  }
  return {
    min, max
  }
} 

export function reduceDataChart(dataset: Array<any> = [], min: any, max: any, key: string = 'value'){
  for (let i = 0; i < dataset.length; i++) {
    if(dataset[i]){
      const value = dataset[i][key] ||  dataset[i];
      if(value && (Number(value) <= max && Number(value) >= min)){
      }else{
        if(dataset[i][key] ){
          dataset[i][key] = null
        }else{
          dataset[i] = null
        }
      }
    }
  }
  return dataset;
}

export function addChartConfiguration(data, isEnabledDivition: boolean = false){
  let subdivition = {}
  if(isEnabledDivition){
    subdivition = {
      numDivLines: "10",
      yAxisValueDecimals: "1",
      forceDecimals: "1",
      forceYAxisValueDecimals: "1",
    }
  }
  return {
    ...data,
    ...subdivition,
    useCrossline: "1"
  }
}

export function convertStringToArr(data: any, color: string, splitor: string = ','){
  if(data){
    data = data.toString().split(splitor);
    for (let i = 0; i < data.length; i++) {
      data[i] = {
        value: data[i],
        color: color
      }
    }
  }
  return data
}


export const moneyFormat = (num = '') => {
  num = num.toString();
  const numArr = num.split('.');
  if(numArr[0]){
    numArr[0] = String(numArr[0]).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,')
  }
  return numArr.join('.');
}


export const dateGapGenerator = (date: any, gapDate: number = 1, target: string = 'day', operation: string = 'plus') => {
  const newDate = new Date(date);
  const addOperration = operation.toLowerCase().match(/plus/gi) || false;
  if(target.toLowerCase().match(/day/gi)){
    if(addOperration){
      newDate.setDate(newDate.getDate() + Number(gapDate))
    }else{
      newDate.setDate(newDate.getDate() - Number(gapDate))
    }
  }else if (target.toLowerCase().match(/month/gi)){
    if(addOperration){
      newDate.setMonth(newDate.getMonth() + Number(gapDate))
    }else{
      newDate.setMonth(newDate.getMonth() - Number(gapDate))
    }
  }else if (target.toLowerCase().match(/year/gi)){
    if(addOperration){
      newDate.setFullYear(newDate.getFullYear() + Number(gapDate))
    }else{
      newDate.setFullYear(newDate.getFullYear() - Number(gapDate))
    }
  }
  return newDate;
}