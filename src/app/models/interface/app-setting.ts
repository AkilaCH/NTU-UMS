import { AttributeConfig } from "./attribute-config";
import { MaintenanceConfig } from "./maintenance-config";

export interface AppSetting {
    api_host: string;
    demo: boolean;
    demoDate: Date;
    defaultColorCode: string;
    attributes: AttributeConfig;
    maintenences: MaintenanceConfig;
    version: string;
}