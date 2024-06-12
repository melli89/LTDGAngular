import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListModel } from '../models/list.model';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  private URL_API = 'http://127.0.0.1:8001';

  constructor(private _http: HttpClient) { }  

  getLists (): Observable<ListModel[]>{
    return this._http.get<ListModel[]>(`${this.URL_API}/listas`)
  }

  getUserLists (id: number): Observable<ListModel[]>{
    return this._http.get<ListModel[]>(`${this.URL_API}/listas/user/${id}`)
  }

  getOneList (id: number): Observable<ListModel>{
    return this._http.get<ListModel>(`${this.URL_API}/listas/${id}`)
  }

  deleteList (id: number) {
    return this._http.delete(`${this.URL_API}/listas/${id}`)
  }

  addList (lista: ListModel) {
    return this._http.post(`${this.URL_API}/listas`, lista)
  }

  modifyList (id: number, lista: ListModel) {
    return this._http.put(`${this.URL_API}/listas${id}`, lista)
  }
  
}