export class Director{
    public position:string|undefined;
    public name:string|undefined;
    public date:string|undefined;
    public endDate:string|undefined;
    public entity:string|undefined;

    constructor(position:string|undefined,name:string|undefined,date:string|undefined,
        endDate:string|undefined,entity:string|undefined
        ) {
        this.position=position;
        this.name=name;
        this.date=date;
        this.endDate=endDate;
        this.entity=entity;
    }
}