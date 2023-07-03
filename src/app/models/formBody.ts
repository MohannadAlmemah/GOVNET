export class formBody{
    type:string;
    fieldId:string;
    value:any;
    constructor(type:string,fieldId:string,value:any){
        this.type=type;
        this.fieldId=fieldId;
        this.value=value;
    }
}