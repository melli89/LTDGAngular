import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent{
  loginPage: boolean=false;

  constructor(private router: Router, private _cookieService:CookieService, ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loginPage = this.router.url === '/login';
      }
    });
  }

  isUserAdmin():boolean{
    let token: string = this._cookieService.get('token'); 
    if(token){
      let tokenPayload = JSON.parse(atob(token.split('.')[1]));
      let roles = tokenPayload.roles;
      if (roles.includes('ROLE_ADMIN')) {
        return true;
      }
    }
    return false;
  }

  isLogged():boolean{
    let token: string = this._cookieService.get('token'); 
    if(token){
      return true;
    }
    return false;
  }

}
