// interface ColorMap {
//   primary: string,
//   secondary: string
// }
// export interface ChartColorMapType {
//   electric: ColorMap,
//   water: ColorMap,
//   cooling: ColorMap,
//   carboon:  ColorMap
// }

export const LIST_DAY_CONSUMPTION: Array<any> = [
  {date: 6, label: '7D', value: 0, target: 'day'}, 
  {date: 30, label: '31D', value: 1, target: 'day'}, 
  {month: 12, label: '12M', value: 2, target: 'month'}, 
  {year: 5, label: '5Y', value: 3, target: 'year'}
];

interface DecimalMap {
  electricalTodayConsumption:  number,
  trendLogs: number,
  electricalBreakDown: number,
  equipDistributionLg: number
}
export const DECIMAL_MAP:DecimalMap = {
  electricalTodayConsumption: 3,
  trendLogs: 0,
  electricalBreakDown: 3,
  equipDistributionLg: 3,
}