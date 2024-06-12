import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private URL_API = 'http://127.0.0.1:8001';

  constructor(private _http: HttpClient) { }  

  loginUser(data:any): Observable<{ token: string } | {}> {
    return this._http.post<{ token: string } | {}>(`${this.URL_API}/login`, data)

  }

  signupUser (data:any): Observable<any>{
    return this._http.post(`${this.URL_API}/users`, data)
  }

  getUsers (): Observable<UserModel[]>{
    return this._http.get<UserModel[]>(`${this.URL_API}/users`)
  }

  deleteUser(id: string): Observable<any> {
    return this._http.delete(`${this.URL_API}/users/${id}`)
  }

  editUser(id:number, user: any): Observable<any>{
    return this._http.put(`${this.URL_API}/users/${id}`, user);
  }

  getUser(id: number): Observable<UserModel> {
    return this._http.get<UserModel>(`${this.URL_API}/users/${id}`);
  }
}