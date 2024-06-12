// auth.service.ts
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor (
        private _cookieService: CookieService
    ) { }
    
    isAuthenticatedUser() {
        let token = this._cookieService.get('token');

        return token ? true : false;
    }
  
    hasRole(role: string): boolean
    {
        let token = this._cookieService.get('token');

        if (token)
        {
            let tokenPayload: any = jwt_decode.jwtDecode(token)
            const roles = tokenPayload.roles;
    
            return roles.includes(role);
        }

        return false;
        
    }
}
  