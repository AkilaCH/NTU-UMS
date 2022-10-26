import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tariff } from 'src/app/models/interface/tariff';
import { InitialService } from '../initial.service';

@Injectable({
  providedIn: 'root'
})
export class TariffService {

  constructor(private http: HttpClient, private initialService: InitialService) { }

  updateTariff(tariff: Tariff): Promise<boolean> {
    return this.http.post<boolean>(this.initialService.config.api_host + '/' + this.initialService.endPoints['update-tariff'], tariff).toPromise();
  }
}
