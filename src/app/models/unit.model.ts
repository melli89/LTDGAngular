export class UnitModel {
    constructor(
        public id:number,
        public ejercito_id :number,
        public categoria:string,
        public nombre:string,
        public tipo:string,
        public punto_mini:number,
        public tamano_minimo:number,
        public tamano_maximo:number
    ) {}
}