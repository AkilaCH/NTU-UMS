import { ReportType } from '../../enums/report-type.enum';
import { LocationType } from '../../enums/location-type.enum';

export class Schedule {
    scheduleId: number;
    scheduleName: string;
    reportType: ReportType;
    location: LocationType;
    dateTime: Date;
    status: boolean;
}
