import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../models/user.model';
import { CreateUserComponent } from '../create-user/create-user.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ListModel } from '../models/list.model';
import { ListService } from '../services/list.service';
import { ArmyService } from '../services/army.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  user: UserModel | null = null;
  id: number | null = null;
  listas: ListModel[] = [];
  nombre_ejercito: string | null = null

  constructor(
    private _userService: UserService, 
    private _cookieService: CookieService,
    private _dialog: MatDialog, 
    private _router: Router, 
    private _listService:ListService,
    private _armyService: ArmyService) {

    let token: string = this._cookieService.get('token'); 

    if (!token) {
      console.log("No hay token")
      return;
    }

    let tokenPayload = JSON.parse(atob(token.split('.')[1]));
    this.id = parseInt(tokenPayload.id);

    this.getUser()
    this.getLists()
  }

  getLists() {
    const subscription = this._listService.getUserLists(this.id!).subscribe({
      next: (data) => {
        this.listas = data;
      }, complete: () => {
        subscription.unsubscribe()
      }, error: console.log
    })
  }

  getUser() {
    const subscription = this._userService.getUser(this.id!).subscribe({
      next: (data) => {
        this.user = data;
      }, complete: () => {
        subscription.unsubscribe()
      }, error: console.log
    })
  }

  openUserPanel(data: UserModel){
    let dialogRef= this._dialog.open(CreateUserComponent, {data});

    dialogRef.afterClosed().subscribe({   
      next: (val) => {
        if (val)
          this.getUser();    
      }
    });
  }

  logOut() {
    this._cookieService.delete('token'); 
    this._router.navigate(['/login'])
  }

  pdf(lista: any) {
    console.log(lista)
    let heros = lista.unidades.filter((value: { model: { categoria: string; }; }) => value.model.categoria == "Personaje");
    let basic = lista.unidades.filter((value: { model: { categoria: string; }; }) => value.model.categoria == "Básica");
    let special = lista.unidades.filter((value: { model: { categoria: string; }; }) => value.model.categoria == "Especial");
    let singular = lista.unidades.filter((value: { model: { categoria: string; }; }) => value.model.categoria == "Singular");

    console.log(lista)

    const doc = new jsPDF()
    //doc.setFont('Medieval Sharp');
    doc.setFontSize(30);

    doc.text(`${lista.ejercito!}`, 70, 20);

    //doc.setFont('Inter');
    doc.setFontSize(25);

    doc.text(`Puntos: ${lista.puntos_partida}`, 70, 30);

    let pos = 40;
    const lineHeight = 10;
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();

    const checkAddPage = (additionalHeight: number) => {
        if (pos + additionalHeight > pageHeight - margin) {
            doc.addPage();
            pos = margin;
        }
    };

    if (heros.length > 0) {
        checkAddPage(15);
        pos += 15;
        //doc.setFont('Medieval Sharp');
        doc.setFontSize(20);
        doc.text(`Héroes`, 10, pos);
        pos += 15;
    }

    heros.forEach((element: { model: { nombre: any; }; totalPoints: any; upgrade: { nombre: any; }; champion: { nombre: undefined; puntos: any; }; }) => {
        checkAddPage(25);
        //doc.setFont('Inter');
        doc.setFontSize(15);
        doc.text(`${element.model.nombre} - ${element.totalPoints} pts`, 10, pos);
        pos += lineHeight;
        doc.setFontSize(12);
        doc.text(`${element.upgrade?.nombre}`, 10, pos);

        if (element.champion?.nombre !== undefined) {
            pos += lineHeight;
            doc.text(`${element.champion?.nombre} - ${element.champion?.puntos} pts`, 10, pos);
        }
        pos += 15;
    });

    if (basic.length > 0) {
        checkAddPage(30);
        pos += 15;
        //doc.setFont('Medieval Sharp');
        doc.setFontSize(20);
        doc.text(`Básicas`, 10, pos);
        pos += 15;
    }

    basic.forEach((element: { model: { nombre: any; }; totalPoints: any; upgrade: { nombre: any; }; champion: { nombre: undefined; puntos: any; }; }) => {
        checkAddPage(25);
        //doc.setFont('Inter');
        doc.setFontSize(15);
        doc.text(`${element.model.nombre} - ${element.totalPoints} pts`, 10, pos);
        pos += lineHeight;
        doc.setFontSize(12);
        doc.text(`${element.upgrade?.nombre}`, 10, pos);

        if (element.champion?.nombre !== undefined) {
            pos += lineHeight;
            doc.text(`${element.champion?.nombre} - ${element.champion?.puntos} pts`, 10, pos);
        }
        pos += 15;
    });

    if (singular.length > 0) {
        checkAddPage(30);
        pos += 15;
        //doc.setFont('Medieval Sharp');
        doc.setFontSize(20);
        doc.text(`Singulares`, 10, pos);
        pos += 15;
    }

    singular.forEach((element: { model: { nombre: any; }; totalPoints: any; upgrade: { nombre: any; }; champion: { nombre: undefined; puntos: any; }; }) => {
        checkAddPage(25);
        //doc.setFont('Inter');
        doc.setFontSize(15);
        doc.text(`${element.model.nombre} - ${element.totalPoints} pts`, 10, pos);
        pos += lineHeight;
        doc.setFontSize(12);
        doc.text(`${element.upgrade?.nombre}`, 10, pos);

        if (element.champion?.nombre !== undefined) {
            pos += lineHeight;
            doc.text(`${element.champion?.nombre} - ${element.champion?.puntos} pts`, 10, pos);
        }
        pos += 15;
    });

    if (special.length > 0) {
        checkAddPage(30);
        pos += 15;
        //doc.setFont('Medieval Sharp');
        doc.setFontSize(20);
        doc.text(`Especiales`, 10, pos);
        pos += 15;
    }

    special.forEach((element: { model: { nombre: any; }; totalPoints: any; upgrade: { nombre: any; }; champion: { nombre: undefined; puntos: any; }; }) => {
        checkAddPage(25);
        //doc.setFont('Inter');
        doc.setFontSize(15);
        doc.text(`${element.model.nombre} - ${element.totalPoints} pts`, 10, pos);
        pos += lineHeight;
        doc.setFontSize(12);
        doc.text(`${element.upgrade?.nombre}`, 10, pos);

        if (element.champion?.nombre !== undefined) {
            pos += lineHeight;
            doc.text(`${element.champion?.nombre} - ${element.champion?.puntos} pts`, 10, pos);
        }
        pos += 15;
    });

    doc.save("documento.pdf");
}

}


