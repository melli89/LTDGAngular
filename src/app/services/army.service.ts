import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArmyModel } from '../models/army.model';

@Injectable({
  providedIn: 'root'
})
export class ArmyService {

  private URL_API = 'http://127.0.0.1:8001';

  constructor(private _http: HttpClient) { }  

  getArmies (): Observable<ArmyModel[]>{
    return this._http.get<ArmyModel[]>(`${this.URL_API}/armies`)
  }

  getArmy(id: number): Observable<ArmyModel> {
    return this._http.get<ArmyModel>(`${this.URL_API}/armies/${id}`)
  }
}