import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.css']
})
export class CalculationComponent {



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
  value:string|undefined;

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

  @Output() 
  refreshFormEvent:EventEmitter<{fieldId: string, shouldRefresh: boolean,containerFieldId:string|undefined,fieldIndex:number|undefined,isContainer:boolean}>=new EventEmitter<{fieldId: string, shouldRefresh: boolean,containerFieldId:string|undefined,fieldIndex:number|undefined,isContainer:boolean}>();


  refreshForm(fieldId: string, shouldRefresh: boolean,containerFieldId:string|undefined,fieldIndex:number|undefined,isContainer:boolean){

    this.refreshFormEvent.emit({ fieldId ,shouldRefresh,containerFieldId,fieldIndex,isContainer});

  }

}
