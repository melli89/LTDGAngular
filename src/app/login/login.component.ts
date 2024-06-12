import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide= true;
  hide2 = true;
  hide3 = true;
  loginForm: FormGroup;
  signupForm: FormGroup

  constructor(
    private fb: FormBuilder, 
    private _router: Router,
    private _loginService: UserService, 
    private _cookieService: CookieService,
    private _sharedService: SharedService
  ){ 
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password2: ['', Validators.required],
    })
  }

  loginUser(){
    if (this.loginForm.valid) {
      const subscription = this._loginService.loginUser(this.loginForm.value).subscribe({
        next: (result: { token: string } | {}) => {
          if ('token' in result) {
            // Guardamos el token en la cookie
            this._cookieService.set('token', result.token);
            
            this._router.navigate(['/home']);
          } else {
            console.log("usuario no existe");
          }
        },
        complete: () => {
          subscription.unsubscribe()
        },
        error: console.log
      });
    }

  }

  signUpUser(){
    if (this.signupForm.valid){
      if(this.signupForm.value.password == this.signupForm.value.password2){
        const subscription = this._loginService.signupUser(this.signupForm.value).subscribe({
          next: (result) => {
            console.log("usuario creado con éxito");
            
            const subscription2 = this._loginService.loginUser(this.signupForm.value).subscribe({
              next: (result: { token: string } | {}) => {
                if ('token' in result) {
                  // Guardamos el token en la cookie
                  this._cookieService.set('token', result.token);
                  
                  this._router.navigate(['/home']);
                } else {
                  console.log("usuario no existe");
                }
              },
              complete: () => {
                subscription2.unsubscribe()
              },
              error: console.log
            });
          },
          complete: () => {
            
            subscription.unsubscribe()
          },
          error: console.log
        });
      }else{
        this._sharedService.openSnackBar("Las contraseñas no son iguales");
      }
    }  
  }
}
