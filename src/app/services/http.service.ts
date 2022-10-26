import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { InitialService } from './initial.service';
import {buildPlaceholder} from '../../util/StringHelper';
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  siteId = new BehaviorSubject<number>(0);

  buildingId = new BehaviorSubject<number>(0);

  serviceTypeId = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient, private configs: InitialService, private initialService: InitialService) { }

  get(url: string, ids: any): Observable<any> {
    return this.http.get(buildPlaceholder(this.initialService.getHost() + "/" + url, {
        siteId: this.siteId.value,
        buildingId: this.buildingId.value,
        serviceTypeId: this.serviceTypeId.value,
        ...ids
      }
    ));
  }

  post(url: string, data, ids: any): Observable<any> {
    return this.http.post(buildPlaceholder(this.initialService.getHost() + "/" + url, {
        siteId: this.siteId.value,
        buildingId: this.buildingId.value,
        serviceTypeId: this.serviceTypeId.value,
        ...ids
      }
    ), data);
  }

  getRequest(url: string, ids: any) {
    return this.http.get((this.initialService.getHost() + "/" + url, {
        siteId: this.siteId.value,
        buildingId: this.buildingId.value,
        serviceTypeId: this.serviceTypeId.value,
        ...ids
      }));
  }

  put(url: string, ids: any, body: any) {
    return this.http.put(buildPlaceholder(this.initialService.getHost() + '/' + url, {...ids}), body);
  }

  delete(url: string, ids: any) {
    return this.http.delete(buildPlaceholder(this.initialService.getHost() + '/' + url, {...ids}));
  }

  setSiteId(siteId: number) {
    this.siteId.next(siteId);
  }

  setbuildingId(buildingId: number) {
    this.buildingId.next(buildingId);
  }

  setserviceTypeId(serviceTypeId: number) {
    this.serviceTypeId.next(serviceTypeId);
  }
}
