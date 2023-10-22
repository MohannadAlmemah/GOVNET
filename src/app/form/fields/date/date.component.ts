import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DateModel, Field } from 'src/app/models/field';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {


  ngOnInit(): void {
    this.minDate = this.processDate(this.field.minDate!);
    this.defaultDate = this.processDate(this.field.defaultDate!);
    this.maxDate = this.processDate(this.field.maxDate!);

  }

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

  defaultDate:string|undefined;
  minDate:string|undefined;
  maxDate:string|undefined;

  updateIsUserType(){
    if(this.formGroup?.get(this.fieldId!)?.value!="" && this.formGroup?.get(this.fieldId!)?.value!=null){
      this.isUserType=true;
    }else{
      this.isUserType=false;
    }
  }


  @Output() 
  refreshFormEvent:EventEmitter<{fieldId: string, shouldRefresh: boolean,containerFieldId:string|undefined,fieldIndex:number|undefined,isContainer:boolean}>=new EventEmitter<{fieldId: string, shouldRefresh: boolean,containerFieldId:string|undefined,fieldIndex:number|undefined,isContainer:boolean}>();


  refreshForm(fieldId: string, shouldRefresh: boolean,containerFieldId:string|undefined,fieldIndex:number|undefined,isContainer:boolean){
    if(this.isUserType){
      this.refreshFormEvent.emit({ fieldId ,shouldRefresh,containerFieldId,fieldIndex,isContainer});
    }

  }

  processDate(dateObj: DateModel): string {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

    let currentDate: Date;
    if (!dateObj.date || dateObj.date.toUpperCase() === "NOW") {
        currentDate = new Date();
    } else {
        currentDate = new Date(dateObj.date);
        // Check if the date is valid
        if (isNaN(currentDate.getTime())) {
            throw new Error(`Invalid date format: ${dateObj.date}`);
        }
    }

    const minusDays = parseInt(dateObj.minusDays || '0', 10);
    const plusDays = parseInt(dateObj.plusDays || '0', 10);

    const resultDate = new Date(currentDate.getTime() + (plusDays - minusDays) * oneDay);

    // Check if the result date is valid
    if (isNaN(resultDate.getTime())) {
        throw new Error('Invalid result date after calculations.');
    }
    
    return resultDate.toISOString().split('T')[0];
}




}
