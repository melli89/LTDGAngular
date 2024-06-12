import { Component } from '@angular/core';
import { OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CreateUserComponent } from '../create-user/create-user.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserModel } from '../models/user.model';
import { SharedService } from '../services/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationComponent } from '../confirmation/confirmation.component';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent/* implements OnInit, OnDestroy*/ {

  displayedColumns:string[] = ['nombre', 'actions'];
  dataSource!: MatTableDataSource<UserModel>;

  usersSubscription: Subscription | undefined;

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog:MatDialog, 
    private _userService:UserService,
    private _sharedService: SharedService,
    private _cookieService: CookieService,
    private _router: Router
  ){};

  //al iniciar el componente se obtiene la lista y se comprueba que el usuario tenga permisos para acceder
  ngOnInit():void{
    this.getUsersList();
  }

  //se destruyen los procesos activos cuando se cierra el componente
  ngOnDestroy(): void {
    this.usersSubscription?.unsubscribe();
  }
  
  //función para listar todos los lugares que hay en la base de datos
  getUsersList(){
    const subscripcion = this._userService.getUsers().subscribe({
      next:(res) =>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      complete: () => {
        subscripcion.unsubscribe()
      },
      error: console.log
    })
  }
  
  //función para buscar una palabra o frase entre los nombres de los lugares
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //función que abre el cuadro de modificación y creación de lugares
  openUserPanel(data?: UserModel){
    let dialogRef;

    if(data)
      dialogRef = this._dialog.open(CreateUserComponent, {data});
    else
      dialogRef = this._dialog.open(CreateUserComponent);

    dialogRef.afterClosed().subscribe({   
      next: (val) => {
        if (val)
          this.getList();    
      }
    });
  }

  //función que carga los datos de la lista de lugares
  getList() {
    this._userService.getUsers().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log
    })
  }

  //función que muestra un cuadro de confirmación de borrado
  confirmation(id: string, nombre:string) {
    const dialogRef = this._dialog.open(ConfirmationComponent, {
      width: '25em',
      data: { titulo: 'Confirmar', mensaje: `¿Estás seguro de que quieres borrar "${nombre}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.deleteUser(id); 
      }
    });
  }

  //función que borra el lugar pasado por parametros
  deleteUser(id: string){
    this._userService.deleteUser(id).subscribe({
      next: (res) => {
        this._sharedService.openSnackBar("El usuario se ha eliminado correctamente.");
        this.getList();
      },
      error: console.log
    })
  }
}