export class Field{
    public id:string;
    public type:string;
    public regex:string|undefined;
    public editable:boolean|undefined;
    public required:boolean;
    public label:string;
    public hidden:boolean|undefined;
    public value:string|undefined;
    public comment:string|undefined;
    public fields:Field[]|undefined;
    public multiSelect:boolean|undefined;
    public options:any[]|undefined;
    public comboBoxOptions:any[]|undefined;
    public keyboardType:string;
    /**
     *
     */
    constructor(id:string,type:string,regex:string|undefined,
        editable:boolean|undefined,required:boolean,label:string,
        hidden:boolean|undefined,value:string|undefined,comment:string|undefined,
        fields:Field[]|undefined,multiSelect:boolean|undefined,options:any[]|undefined,
        comboBoxOptions:any[]|undefined,keyboardType:string
        ) {
            this.id=id;
            this.type=type;
            this.regex=regex;
            this.label=label;
            this.editable=editable;
            this.required=required;
            this.hidden=hidden;
            this.value=value;
            this.comment=comment;
            this.fields=fields;
            this.multiSelect=multiSelect;
            this.options=options;
            this.comboBoxOptions=comboBoxOptions;
            this.keyboardType=keyboardType;
        }
}