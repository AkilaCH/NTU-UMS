class NotificationItem {
    private _MeterName: string = '';
    private _SpikeValue: number = 0;
    private _BenchmarkValue: number = 0;
    private _AlertTimeStamp: string = '';
    private _meter2: string = '';
    private _toTime: string = '';
    private _Direction: string = '';


    constructor(meterName, spikeValue, benchmarkValue, alertTimeStamp, meter2, toTime,direction) {
        this.MeterName = meterName;
        this.SpikeValue = spikeValue;
        this.BenchmarkValue = benchmarkValue;
        this.AlertTimeStamp = alertTimeStamp;
        this.Meter2 = meter2;
        this.ToTime = toTime;
        this._Direction=direction;
    }

    get SpikeValue(): number {
        return this._SpikeValue;
    }
    set SpikeValue(value: number) {
        this._SpikeValue = value;
    }

    get MeterName(): string {
        return this._MeterName;
    }
    set MeterName(value: string) {
        this._MeterName = value;
    }

    get BenchmarkValue(): number {
        return this._BenchmarkValue;
    }
    set BenchmarkValue(value: number) {
        this._BenchmarkValue = value;
    }

    get AlertTimeStamp(): string {
        return this._AlertTimeStamp;
    }
    set AlertTimeStamp(value: string) {
        this._AlertTimeStamp = value;
    }

    get Meter2(): string {
        return this._meter2;
    }
    set Meter2(value: string) {
        this._meter2 = value;
    }

    get ToTime(): string {
        return this._toTime;
    }
    set ToTime(value: string) {
        this._toTime = value;
    }

    get Direction(): string {
        return this._Direction;
    }
    set Direction(value: string) {
        this._Direction = value;
    }
}

export default NotificationItem;