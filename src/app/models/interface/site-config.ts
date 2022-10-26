import { ChillerData } from "./chiller-data";

export interface SiteConfig {
    siteId : number;
    siteName : string;
    decimalNumPrecision: number;
    realTimeConsumptiondecimalNumPrecision: number;
    chillerData: ChillerData;
    chillerEfficiencyBaseLineValue: number;
    maxAllowDateRange: number;
}