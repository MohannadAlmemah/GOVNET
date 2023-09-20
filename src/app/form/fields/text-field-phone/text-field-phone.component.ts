import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-text-field-phone',
  templateUrl: './text-field-phone.component.html',
  styleUrls: ['./text-field-phone.component.css']
})
export class TextFieldPhoneComponent implements AfterViewInit {

  
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

  @Input()
  phoneNumber:any|undefined;

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Jordan];



  constructor() {
   
  }
  ngAfterViewInit(): void {
   
    if(this.phoneNumber !=undefined && this.phoneNumber!="" && this.phoneNumber!=null){
      console.log(this.phoneNumber);
    }
    
  }

  refreshForm(fieldId: string, shouldRefresh: boolean){
    this.refreshFormEvent.emit({fieldId,shouldRefresh});
  }


}
