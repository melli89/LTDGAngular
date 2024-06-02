import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnitModel } from '../models/unit.model';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private URL_API = 'http://127.0.0.1:8001';

  constructor(private _http: HttpClient) { }  

  getUnits (): Observable<UnitModel[]>{
    return this._http.get<UnitModel[]>(`${this.URL_API}/units`)
  }
  
  getCG (id: string): Observable<UnitModel[]>{
    return this._http.get<UnitModel[]>(`${this.URL_API}/units/${id}/cg`)
  }

  getBasics (id: string): Observable<UnitModel[]>{
    return this._http.get<UnitModel[]>(`${this.URL_API}/units/${id}/basica`)
  }
  getSpecials (id: string): Observable<UnitModel[]>{
    return this._http.get<UnitModel[]>(`${this.URL_API}/units/${id}/specials`)
  }
  getRares (id: string): Observable<UnitModel[]>{
    return this._http.get<UnitModel[]>(`${this.URL_API}/units/${id}/rare`)
  }

  
}