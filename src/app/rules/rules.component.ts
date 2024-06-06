import { Component, OnInit } from '@angular/core';
import { ReglasModel } from '../models/reglas.model';
import { RulesService } from '../services/rules.service';
import { ActivatedRoute } from '@angular/router';
import { UpgradeService } from '../services/upgrade.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit{

  rules: ReglasModel[] = [];
 
  groupedTerms: { [key: string]: ReglasModel[] } = {};


  constructor(
    private _rulesService:RulesService,
    private _route: ActivatedRoute,
    private _upgradeService:UpgradeService
  ){}

  ngOnInit(): void {
    const subscription = this._rulesService.getRules().subscribe({
      next:(data)=>{
        this.rules = data;
        this.groupByLetter();
      },complete:()=>{


        subscription.unsubscribe();
      },error:console.log
  })
  }

  groupByLetter(){
    this.rules.forEach(rule => {
      const letter = rule.nombre.charAt(0).toUpperCase();
      if (!this.groupedTerms[letter]) {
        this.groupedTerms[letter] = [];
      }
      this.groupedTerms[letter].push(rule);
    });
  }

  get alphabet(): string[] {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  }

  scrollToElement(element:any): void {

    (document.getElementById(element) as HTMLElement).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }


}

