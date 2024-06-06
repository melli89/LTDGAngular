import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReglasModel } from '../models/reglas.model';

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  private URL_API = 'http://127.0.0.1:8001';

  constructor(private _http: HttpClient) { }  

  getRules (): Observable<ReglasModel[]>{
    return this._http.get<ReglasModel[]>(`${this.URL_API}/rules`)
  }

  
}