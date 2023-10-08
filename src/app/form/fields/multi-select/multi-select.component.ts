import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css']
})
export class MultiSelectComponent {

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

  @Input()
  isContainer:boolean=false;

  @Input()
  containerFieldId:string|undefined=undefined;

  @Input()
  fieldIndex:number|undefined=undefined;
  
  @Output() 
  refreshFormEvent:EventEmitter<{fieldId: string, shouldRefresh: boolean,containerFieldId:string|undefined,fieldIndex:number|undefined,isContainer:boolean}>=new EventEmitter<{fieldId: string, shouldRefresh: boolean,containerFieldId:string|undefined,fieldIndex:number|undefined,isContainer:boolean}>();


  refreshForm(fieldId: string, shouldRefresh: boolean,containerFieldId:string|undefined,fieldIndex:number|undefined,isContainer:boolean){

    this.refreshFormEvent.emit({ fieldId ,shouldRefresh,containerFieldId,fieldIndex,isContainer});

  }
}
