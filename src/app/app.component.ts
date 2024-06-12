import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isHomePage: boolean = false;

  constructor(private router: Router, private _cookieService: CookieService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = this.router.url === '/home';
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