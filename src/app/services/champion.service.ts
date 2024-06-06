import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArmyModel } from '../models/army.model';
import { ChampionModel } from '../models/champion.model';

@Injectable({
  providedIn: 'root'
})
export class ChampionService {

  private URL_API = 'http://127.0.0.1:8001';

  constructor(private _http: HttpClient) { }  

  getChampions (id_unidad: number): Observable<ChampionModel>{
    return this._http.get<ChampionModel>(`${this.URL_API}/champions/${id_unidad}`)
  }

  
}