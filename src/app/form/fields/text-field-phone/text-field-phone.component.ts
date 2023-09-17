import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-text-field-phone',
  templateUrl: './text-field-phone.component.html',
  styleUrls: ['./text-field-phone.component.css']
})
export class TextFieldPhoneComponent {

  
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

  
  refreshForm(fieldId: string, shouldRefresh: boolean){
    this.refreshFormEvent.emit({fieldId,shouldRefresh});
  }

}
