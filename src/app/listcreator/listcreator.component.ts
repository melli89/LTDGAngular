import { Component } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  copyArrayItem,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { UnitModel } from '../models/unit.model';
import { UnitService } from '../services/unit.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-listcreator',
  templateUrl: './listcreator.component.html',
  styleUrls: ['./listcreator.component.css'],
})
export class ListcreatorComponent{

  cgItems: UnitModel[] = new Array<UnitModel>;
  basicItems: UnitModel[] = new Array<UnitModel>;
  specialItems: UnitModel[] = new Array<UnitModel>;
  singularItems: UnitModel[] = new Array<UnitModel>;
  

  ejercito_id = null;

  basket: UnitModel[] = new Array<UnitModel>;

  constructor(
    private _unitService:UnitService,
    private _route: ActivatedRoute
  ){
    let ejercito_id = this._route.snapshot.paramMap.get("id");

    ejercito_id = ejercito_id ? ejercito_id : '1';

    this.getCG(ejercito_id);
    this.getBasics(ejercito_id);
    this.getSpecials(ejercito_id);
    this.getSingulars(ejercito_id);
    
  }

  getCG (ejercito_id: string) {
    const subscription = this._unitService.getCG(ejercito_id).subscribe({
      next:(data)=>{
        this.cgItems = data;
      },
      complete:() =>{
        console.log(this.cgItems);
        subscription.unsubscribe();
      },error:console.log
    })
  }

  getBasics (ejercito_id: string) {
    const subscription = this._unitService.getBasics(ejercito_id).subscribe({
      next:(data)=>{
        this.basicItems = data;
      },
      complete:() =>{
        console.log(this.basicItems);
        subscription.unsubscribe();
      },error:console.log
    })
  }

  getSpecials (ejercito_id: string) {
    const subscription = this._unitService.getSpecials(ejercito_id).subscribe({
      next:(data)=>{
        this.specialItems = data;
      },
      complete:() =>{
        console.log(this.specialItems);
        subscription.unsubscribe();
      },error:console.log
    })
  }

  getSingulars (ejercito_id: string) {
    const subscription = this._unitService.getRares(ejercito_id).subscribe({
      next:(data)=>{
        this.singularItems = data;
      },
      complete:() =>{
        console.log(this.singularItems);
        subscription.unsubscribe();
      },error:console.log
    })
  }


  drop(event: CdkDragDrop<UnitModel[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      //cacular puntos
    }
  }

  delete(event: CdkDragDrop<UnitModel[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      event.previousContainer.data.splice(event.previousIndex,1)
      event.container.data.splice(event.currentIndex,1)

      //calcular puntos
    }
  }

  display(position: number) {
    let divs = document.getElementsByClassName('example-list');

    for (let div in divs) {
      if (parseInt(div) < 4) {
        if (divs[div].classList.contains('selected')) {
          divs[div].classList.remove('selected')
        }
      }
      
    }

    divs[position].classList.add('selected')
  }

  editUnit(id: number){

  }
}
