import { Component, OnInit } from '@angular/core';
import { ArmyModel } from '../models/army.model';
import { ArmyService } from '../services/army.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  armies_info : ArmyModel[] = [];

  constructor(private _armyService:ArmyService){}
  ngOnInit(): void {
    const subscription = this._armyService.getArmies().subscribe({
      next:(data)=>{
        this.armies_info = data;
      },complete:()=>{


        subscription.unsubscribe();
      },error:console.log
  })
    
  }

}
