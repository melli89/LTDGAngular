import { Component } from '@angular/core';
import { UnitModel } from '../models/unit.model';
import { UnitService } from '../services/unit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChampionService } from '../services/champion.service';
import { ChampionModel } from '../models/champion.model';
import { UpgradeService } from '../services/upgrade.service';
import { UpgradeModel } from '../models/upgrade.model';
import { ListModel } from '../models/list.model';
import { CookieService } from 'ngx-cookie-service';
import { ListService } from '../services/list.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-listcreator',
  templateUrl: './listcreator.component.html',
  styleUrls: ['./listcreator.component.css'],
})
export class ListcreatorComponent{

  cgItems: Array<UnitModel> = new Array<UnitModel>;
  basicItems: Array<UnitModel> = new Array<UnitModel>;
  specialItems: Array<UnitModel> = new Array<UnitModel>;
  singularItems: Array<UnitModel> = new Array<UnitModel>;
  
  contadorId: number = 1; //para dar id unico a los elementos de basket
  unit: {id: number, model:UnitModel, champion: ChampionModel|null, minisAmount: number, totalPoints: number,upgrade:UpgradeModel|null} | null = null;
  champion: ChampionModel | null = null;
  upgrades: UpgradeModel[] = [];
  ejercito_id: string | null = null;
  handWeapon: UpgradeModel |null = null;
  totalPoints: number = 0;

  //CON MODEL SERIA: basket: Array<{model: UnitModel}>
  //cuando se le quieran añadir objetos especiales y reglas tienen que añadirse como atributos del objeto
  // ej: basket: Array<{model: UnitModel, reglas: Array<ReglasModel>}>
  basket: Array<{id: number, model: UnitModel,champion: ChampionModel|null, minisAmount:number, totalPoints: number,upgrade:UpgradeModel|null}> = [];

  constructor(
    private _unitService:UnitService,
    private _route: ActivatedRoute,
    private _championService:ChampionService,
    private _upgradeService:UpgradeService,
    private _cookieService: CookieService,
    private _listService: ListService,
    private _sharedService: SharedService
  ){
    let ejercito_id = this._route.snapshot.paramMap.get("id");

    this.ejercito_id = ejercito_id ? ejercito_id : '1';

    this.getCG(this.ejercito_id);
    this.getBasics(this.ejercito_id);
    this.getSpecials(this.ejercito_id);
    this.getSingulars(this.ejercito_id);
  }

  getCG (ejercito_id: string) {
    const subscription = this._unitService.getCG(ejercito_id).subscribe({
      next:(data)=>{
        this.cgItems = data;
      },
      complete:() =>{

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

        subscription.unsubscribe();
      },error:console.log
    })
  }

  //add(item: UnitModel)
  add(item: UnitModel): void {
    const subscription = this._upgradeService.getFreeUpgrades(item.id).subscribe({
      next:(data:UpgradeModel)=>{
        this.handWeapon = data;
      
      },
      complete:() =>{
        //si no se existe en la lista se añade el item y se le da la cantidad 1
        this.basket.push({id: this.contadorId, model: item, champion: null, minisAmount: item.tamano_minimo, totalPoints: item.tamano_minimo*item.punto_mini,upgrade:this.handWeapon});

        this.contadorId++;
        this.calcularTotal();
        this.unit = null;
        subscription.unsubscribe();
      },error:console.log
    }) 
    
  }

  //borra una unidad de la lista
  delete(id: number): void {
    this.basket = this.basket.filter(model => model.id !== id);
    this.calcularTotal();
    this.unit = null;
  }

  display(position: number) {
    let divs = document.getElementsByClassName('unit');

    for (let div in divs) {
      if (parseInt(div) < 4) {
        if (divs[div].classList.contains('selected')) {
          divs[div].classList.remove('selected')
        }
      }
    }
    divs[position].classList.add('selected');
    this.unit = null;
  }

  guardarLista() {
    let token: string = this._cookieService.get('token'); 

    if (!token) {
      console.log("No hay token")
      return;
    }

    let tokenPayload = JSON.parse(atob(token.split('.')[1]));
    let user = tokenPayload.id;

    let lista = new ListModel(
      null,
      (new Date()).toISOString(),
      this.totalPoints,
      parseInt(user),
      parseInt(this.ejercito_id!),
      this.basket
    )
    
    const subscription = this._listService.addList(lista).subscribe({
      next: () => {
        this._sharedService.openSnackBar("Lista guardada")
      }, complete: () => {
        subscription.unsubscribe();
      }, error: console.log
    })

  }

  editUnit(item: {id:number, model: UnitModel, champion: ChampionModel|null, minisAmount: number,totalPoints:number,upgrade:UpgradeModel|null}){
    

    this.unit = item;
    let size = (document.getElementById("unitSize") as HTMLInputElement).value = item.minisAmount.toString();
    this.getchampion(this.unit.model.id);
    this.getUpgrades(this.unit.model.id);
    
  }

  getUpgrades(id_unidad: number){
    const subscription = this._upgradeService.getUpgradesUnit(id_unidad).subscribe({
      next:(data:UpgradeModel[])=>{
        this.upgrades = data;
      
      },
      complete:() =>{

        subscription.unsubscribe();
      },error:console.log
    })
  }

  getchampion(id_unidad: number){
    const subscription = this._championService.getChampions(id_unidad).subscribe({
      next:(data:ChampionModel)=>{
        this.champion = data.nombre ? data : null;
      
      },
      complete:() =>{

        subscription.unsubscribe();
      },error:console.log
    })
  }

  isChampion() {
    let resul = this.champion ? true : false;
    console.log(resul);
    return resul;
 }
 
 setSize(event:Event){
    let input = (event.target as HTMLInputElement).value;
    this.unit!.minisAmount = parseInt(input);
    this.calcular();

 }

 checkIfChecked(event:Event){
    let checkbox = (event.target as HTMLInputElement);
    if(checkbox.checked){
      this.unit!.champion = this.champion;
    
    }else{
      this.unit!.champion = null;
    }

    this.calcular();
 }

 checkRadios(){
   let inputs = document.getElementsByName('upgrades');
   for (let position in inputs){
      let input = (inputs[position] as HTMLInputElement);
      if(input.checked){
        let idInput = input.value;
        this.upgrades.forEach( positionList => {
            if (positionList.id == parseInt(idInput)){
              this.unit!.upgrade = positionList;
            }
        });
      }
   }
   this.calcular();
 }

 calcular(){
  let ptosCampeon=0;
  let totalPuntos = 0;
  let tamanoUnidad = this.unit!.minisAmount;
  let ptosMini = this.unit!.model.punto_mini;
  totalPuntos = ptosMini * tamanoUnidad;
  let ptosMejora = 0;

  if(this.unit!.champion != null){
    ptosCampeon= this.unit!.champion!.puntos;
    totalPuntos += ptosCampeon;
  }
  

  if(this.unit!.upgrade != null){
    ptosMejora = this.unit!.upgrade.puntos;
    totalPuntos += (ptosMejora*tamanoUnidad);
  }

  this.unit!.totalPoints = totalPuntos;
  this.calcularTotal();
 }

 calcularTotal(){
  this.totalPoints = 0;
  this.basket.forEach(unit => {
      this.totalPoints += unit.totalPoints;
  });
 }

}