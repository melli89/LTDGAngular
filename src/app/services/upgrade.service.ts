import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpgradeModel } from '../models/upgrade.model';

@Injectable({
  providedIn: 'root'
})
export class UpgradeService {

  private URL_API = 'http://127.0.0.1:8001';

  constructor(private _http: HttpClient) { }  

  getUpgradesUnit (id_unidad: number): Observable<UpgradeModel[]>{
    return this._http.get<UpgradeModel[]>(`${this.URL_API}/upgrades/${id_unidad}`)
  }

  getFreeUpgrades (id_unidad: number): Observable<UpgradeModel>{
    return this._http.get<UpgradeModel>(`${this.URL_API}/upgrades/${id_unidad}/free`)
  }
}