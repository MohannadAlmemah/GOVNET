import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.css']
})
export class ComboBoxComponent {

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
  options:any[]=[];

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


  refreshForm(fieldId: string, shouldRefresh: boolean,containerId:string|undefined,fieldIndex:number|undefined,isContainer:boolean){

    var containerFieldId= containerId != undefined ? this.getBasitFieldName(containerId) : undefined;

    this.refreshFormEvent.emit({ fieldId ,shouldRefresh, containerFieldId ,fieldIndex,isContainer});

  }

  getBasitFieldName(fieldId:string):string{
    const index = fieldId.indexOf("#");
    const newFieldId = index !== -1 ? fieldId.slice(0, index) : fieldId; 

    return newFieldId;
  }
  
}
