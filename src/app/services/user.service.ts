import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  
}