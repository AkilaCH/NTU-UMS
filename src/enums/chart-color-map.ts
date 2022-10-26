interface ColorMap {
  primary: string,
  secondary: string
}
export interface ChartColorMapType {
  electric: ColorMap,
  water: ColorMap,
  cooling: ColorMap,
  carboon:  ColorMap
}

export const ChartColorMap: ChartColorMapType = {
  electric: {
    primary: '#ffa500',
    secondary: '#c07604'
  },
  water: {
    primary: '#007bff',
    secondary: '#0462c6'
  },
  cooling: {
    primary: '#11b72c',
    secondary: '#0b871f'
  },
  carboon: {
    primary: '#d8ff00',
    secondary: '#8da40e'
  },
}

export enum DevicerNumber {
  electrical = 1
}