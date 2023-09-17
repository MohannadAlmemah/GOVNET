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

  @Output() 
  refreshFormEvent:EventEmitter<{fieldId: string, shouldRefresh: boolean}>=new EventEmitter<{fieldId: string, shouldRefresh: boolean}>();

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


  refreshForm(fieldId: string, shouldRefresh: boolean){
    this.refreshFormEvent.emit({fieldId,shouldRefresh});
  }

}
