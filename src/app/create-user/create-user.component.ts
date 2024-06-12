import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../models/user.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit{

  hide: any;
  signupForm: FormGroup;
  
  

  constructor(
    private fb: FormBuilder, 
    private _router: Router,
    private _loginService: UserService, 
    private _cookieService: CookieService,
    private _dialogRef: MatDialogRef<CreateUserComponent>,
    private _sharedService: SharedService,

    @Inject(MAT_DIALOG_DATA) public data: UserModel
  ){ 

    this.signupForm = this.fb.group({
      email: ['', Validators.required],
      password: [''],
      password2: [''],
    })
  }

  ngOnInit(): void {
    this.signupForm.patchValue(this.data);
  }

  signUpUser(){
    if (this.signupForm.valid  && this.signupForm.value.password == this.signupForm.value.password2) {
      if(this.data && this.data.id !== undefined) {
        const subscription = this._loginService.editUser(this.data.id, this.signupForm.value).subscribe({
          next: (result:any) => {
            
            this._sharedService.openSnackBar("El usuario ha sido modificado correctamente.");
            this._dialogRef.close(true);      
          },
          complete: () => {
            
            subscription.unsubscribe()
          },
          error: console.log
        });
      } else {
        const subscription = this._loginService.signupUser(this.signupForm.value).subscribe({
          next: (result) => {
            this._sharedService.openSnackBar("El usuario ha sido creado correctamente.");
            this._dialogRef.close(true);      

          },
          complete: () => {
            
            subscription.unsubscribe()
          },
          error: console.log
        });
      }
    }
  }
}
