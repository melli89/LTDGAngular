import { ChampionModel } from "./champion.model";
import { UnitModel } from "./unit.model";
import { UpgradeModel } from "./upgrade.model";

export class ListModel {
    constructor(
        public id:number | null,
        public nombre_lista:string | null,
        public puntos_partida:number | null,
        public user:number | null,
        public ejercito: number | null,
        public unidades: {id:number, minisAmount:number, totalPoints:number, model: UnitModel, champion: ChampionModel|null, upgrade: UpgradeModel|null}[]
    ) {}
}