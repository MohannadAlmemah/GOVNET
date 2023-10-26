import { parentModel } from "./parent";

export class DateModel{
    public date:string|undefined;
    public minusDays:string|undefined;
    public plusDays:string|undefined;
}

export class Equation {
    public type: string|undefined
    public operation: string|undefined
    fieldId: string|undefined
    containerId: string|undefined
}
  
export class Field{
    public id:string;
    public type:string;
    public withTime:boolean;
    public designType:string;
    public modifiable:boolean|undefined;
    public regex:string|undefined;
    public editable:boolean|undefined;
    public required:boolean;
    public label:string;
    public equation:Equation|undefined;
    public textDirection:string|undefined;
    public mediaType:string|undefined;
    public allowedExtensions:string[]|undefined;
    public textFieldType:string|undefined;
    public hidden:boolean|undefined;
    public value:any|undefined;
    public comment:string|undefined;
    public fields:Field[]|undefined;
    public multiSelect:boolean|undefined;
    public options:any[]|undefined;
    public comboBoxOptions:any[]|undefined;
    public keyboardType:string;
    public description:string;
    public approved:boolean|undefined;
    public shouldRefresh:boolean;
    public parent:parentModel|undefined;

    public oldRequired:boolean|undefined;
    public oldHidden:boolean|undefined;
    public oldEditable:boolean|undefined;
    public oldModifiable:boolean|undefined;

    public url:string|undefined;

    public defaultDate:DateModel|undefined;
    public minDate:DateModel|undefined;
    public maxDate:DateModel|undefined;

    /**
     *
     **/
    constructor(id:string,type:string,regex:string|undefined,textFieldType:string|undefined,
        editable:boolean|undefined,required:boolean,label:string,modifiable:boolean|undefined,
        hidden:boolean|undefined,value:any|undefined,comment:string|undefined,
        fields:Field[]|undefined,multiSelect:boolean|undefined,options:any[]|undefined,
        comboBoxOptions:any[]|undefined,keyboardType:string,designType:string,description:string,
        approved:boolean|undefined,shouldRefresh:boolean,parent:parentModel|undefined,
        url:string|undefined,mediaType:string|undefined,allowedExtensions:string[]|undefined,
        withTime:boolean, defaultDate:DateModel|undefined,minDate:DateModel|undefined,
        maxDate:DateModel|undefined,textDirection:string|undefined,
        equation:Equation|undefined
        ) {
            this.id=id;
            this.type=type;
            this.regex=regex;
            this.label=label;
            this.editable=editable;
            this.mediaType=mediaType;
            this.allowedExtensions=allowedExtensions;
            this.textFieldType=textFieldType;
            this.required=required;
            this.hidden=hidden;
            this.value=value;
            this.comment=comment;
            this.fields=fields;
            this.multiSelect=multiSelect;
            this.options=options;
            this.comboBoxOptions=comboBoxOptions;
            this.keyboardType=keyboardType;
            this.designType=designType;
            this.description=description;
            this.approved=approved;
            this.shouldRefresh=shouldRefresh;
            this.parent=parent;
            this.modifiable=modifiable;
            this.url=url;
            this.withTime=withTime;
            this.textDirection=textDirection;

            this.defaultDate=defaultDate;
            this.minDate=minDate;
            this.maxDate=maxDate;
            this.equation=equation;
        }
}