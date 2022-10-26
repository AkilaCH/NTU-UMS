import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gfa } from 'src/app/models/interface/gfa';
import { GfaProp } from 'src/app/models/interface/gfa-prop';
import { InitialService } from '../initial.service';

@Injectable({
  providedIn: 'root'
})
export class GfaService {

  constructor(private http: HttpClient, private initialService: InitialService) { }

  updateGfa(gfa: GfaProp): Promise<boolean> {
    return this.http.post<boolean>(this.initialService.config.api_host + '/' + this.initialService.endPoints['update-gfa'], gfa).toPromise();
  }

  getBuildingGfa(id: number): Promise<Gfa> {
    return this.http.get<Gfa>(this.initialService.config.api_host + '/' + this.initialService.endPoints['get-building-gfa'].replace('${buildingId}', id)).toPromise();
  }

  getBuildingGroupGfa(id: number): Promise<Gfa> {
    return this.http.get<Gfa>(this.initialService.config.api_host + '/' + this.initialService.endPoints['get-buildingGroup-gfa'].replace('${buildingGroupId}', id)).toPromise();
  }
}
