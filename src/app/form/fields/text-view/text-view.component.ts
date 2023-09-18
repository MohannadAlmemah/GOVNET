import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-text-view',
  templateUrl: './text-view.component.html',
  styleUrls: ['./text-view.component.css']
})
export class TextViewComponent {

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

  @Output() 
  refreshFormEvent:EventEmitter<{fieldId: string, shouldRefresh: boolean}>=new EventEmitter<{fieldId: string, shouldRefresh: boolean}>();

  
  refreshForm(fieldId: string, shouldRefresh: boolean){
    this.refreshFormEvent.emit({fieldId,shouldRefresh});
  }
}
