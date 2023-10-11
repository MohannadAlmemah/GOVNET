import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.css']
})
export class TextFieldComponent {


  @Input() formGroup: UntypedFormGroup|undefined;

  @Input()
  field!: Field;

  @Input()
  isUserType:boolean=false;

  @Input()
  fieldId:string|undefined;

  @Input()
  yourTurn:boolean|undefined;

  @Input()
  submitted:boolean|undefined;

  @Input()
  control!: any;

  @Input()
  errors:any;

  @Input()
  isInvalid:boolean=false;

  @Input()
  containerFieldId:string|undefined=undefined;

  @Input()
  fieldIndex:number|undefined=undefined;

  @Input()
  isContainer:boolean=false;


  updateIsUserType(){
    if(this.formGroup?.get(this.fieldId!)?.value!="" && this.formGroup?.get(this.fieldId!)?.value!=null){
      this.isUserType=true;
    }else{
      this.isUserType=false;
    }
  }

  getTextFieldType(tpye:string):string{

    if(tpye=="text"){
      return "text";
    }
    else if(tpye=="integer"){
      return "number";
    }
    else if(tpye=="decimal"){
      return "number";
    }
    else if(tpye=="password"){
      return "password";
    }
    else if(tpye=="date"){
      return "date";
    }else{
      return "text";
    }

  }

  @Output() 
  refreshFormEvent:EventEmitter<{fieldId: string, shouldRefresh: boolean,containerFieldId:string|undefined,fieldIndex:number|undefined,isContainer:boolean}>=new EventEmitter<{fieldId: string, shouldRefresh: boolean,containerFieldId:string|undefined,fieldIndex:number|undefined,isContainer:boolean}>();


  refreshForm(fieldId: string, shouldRefresh: boolean,containerFieldId:string|undefined,fieldIndex:number|undefined,isContainer:boolean){

    if(this.isUserType){
      this.refreshFormEvent.emit({ fieldId ,shouldRefresh,containerFieldId,fieldIndex,isContainer});
    }

  }

}
