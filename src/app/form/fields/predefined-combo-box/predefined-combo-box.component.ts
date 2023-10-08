import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-predefined-combo-box',
  templateUrl: './predefined-combo-box.component.html',
  styleUrls: ['./predefined-combo-box.component.css']
})
export class PredefinedComboBoxComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    // console.log(this.field);
  }

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

  /**
   *
   */



}
