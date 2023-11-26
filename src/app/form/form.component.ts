import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/apiService';
import { SweetAlertService } from 'src/services/sweetAlertService';
import { Field } from '../models/field';
import {Container} from '../models/ContainerField';
import { formBody } from '../models/formBody';
import { FileModel } from '../models/file';
import {ConditionType} from '../models/enum/conditionType';
import { AuthService } from 'src/services/auth.service';
import * as _ from 'lodash';
import { Observable, map } from 'rxjs';
import { CalculationComponent } from './fields/calculation/calculation.component';

export class FieldInfo{
  filedValue:any|undefined;
  fieldType:string|undefined;


  constructor(filedValue:any,fieldType :string) {
    this.fieldType=fieldType;
    this.filedValue=filedValue;
  }
}


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  encapsulation:ViewEncapsulation.None,
})


export class FormComponent implements OnInit {

  @ViewChild(CalculationComponent) childComponent!: CalculationComponent;

  fields:Field[];

  myForm:UntypedFormGroup; 
  files:FileModel[];
  serviceId:string|undefined;
  BluePrintId:string|undefined;
  isLoading=true;
  service:any;
  submitted = false;
  containers:Container[]=[];
  serviceName:string|undefined;
  serviceCard:any;
  yourTurn=false;
  payment=false;

  showSubmit=true;
  textViewItemArr:any[]=[];
  message:string|undefined;
  showStep="1";

  phoneDto:any;
  disableConditionBtn=false;

  viewApplication=false;
  steps:any[]=[];
  stepsName:any[]=[];
  currentIndex=0;

  serviceType:string|undefined;

  applyForServiceBody:any;

  doesFormGenerated=false;

  currentSubmitButtonText:string|undefined;

  private scrollToFirstInvalidControl() {
    let firstInvalidControl = $("input.is-invalid,select.is-invalid")[0];
    firstInvalidControl.scrollIntoView();
    (firstInvalidControl as HTMLElement).focus();
  }

  //9861049531
  constructor(private apiService:ApiService,private route: ActivatedRoute, private el: ElementRef,
    private sweetAlertService:SweetAlertService,private authService:AuthService,private fb: FormBuilder
    ) {
    this.myForm=new UntypedFormGroup({});
    this.files=[];
    this.fields=[];
    
  }

  goStep1(){
    this.showStep="1";
  }

  goStep2(){
    if(this.doesFormGenerated==false){
      this.applyForService(this.applyForServiceBody);
    }
    this.showStep="2";
  }

  disableFormControls(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control!.disable(); // Disable the control
      control!.markAsUntouched();
      control!.markAsPristine();
      if (control instanceof FormGroup) {
        this.disableFormControls(control); // Recursively disable controls in nested form groups
      }
    });
  }

  
  

  fillApplication(){

    var request=this.apiService.get(`carboncopies/GetServiceByIdForConsumer?serviceId=${this.serviceId}&type=${this.serviceType}`);

    request.subscribe(response=>{

      var data=response.data;

      this.serviceName=data.name;

      this.steps = (data.steps as any[]).reverse();

      this.generateField(this.steps[0]?.fields,false);

      

      this.steps.map(step=>{
        this.stepsName.push(step.name);
      });

      this.onParentChange(this.fields);

      this.disableFormControls(this.myForm);
      this.goStep2();

      this.viewApplication=true;

      this.isLoading=false;

    });
  }

  goNext(){
    
    this.currentIndex<this.steps.length-1? this.currentIndex++:this.currentIndex;
    
    if(this.currentIndex<=this.steps.length-1){

      this.removeFormControls();
    
      this.generateField(this.steps[this.currentIndex]?.fields,false);
  
      this.onParentChange(this.fields);
  
      this.disableFormControls(this.myForm);
  
      this.isLoading=false;
    }
  }

  goBack(){

    this.currentIndex>0? this.currentIndex--:this.currentIndex;

    if(this.currentIndex>=0){

      this.removeFormControls();
      
      this.generateField(this.steps[this.currentIndex]?.fields,false);
  
      this.onParentChange(this.fields);
  
      this.disableFormControls(this.myForm);
  
      this.isLoading=false;
      }
  }


  ngOnInit(): void {


    if (this.route.snapshot.queryParams['serviceId'] && this.route.snapshot.queryParams['showForm']) {

      this.serviceId= this.route.snapshot.queryParams['serviceId'];
      this.serviceType= this.route.snapshot.queryParams['serviceType'];

      this.doesFormGenerated=true;

      this.fillApplication();
    }

    else if (this.route.snapshot.queryParams['BluePrintId']) {

      const bluePrintId = this.route.snapshot.queryParamMap.get('BluePrintId');

      var sectionId = this.route.snapshot.queryParamMap.get('SectionId');

      if(bluePrintId!=null && sectionId!=null){

        this.BluePrintId=bluePrintId;

      }

      var Services=this.apiService.get('categorization/GetServicesWithSectionId?id='+sectionId!);

      Services.subscribe(response=>{
  
        var data=response.data as any[];
  
        var service=data.filter(x=>x.id==this.BluePrintId)[0];

        this.serviceName=service.name;
        this.serviceCard=service.serviceCard;
  
        var rootValues=service.rootValues as any[];
  
          this.applyForServiceBody ={
            "serviceId": this.BluePrintId,
              "rootValues": rootValues.map(x=>{
                return{
                  "fieldId": x.fieldId,
                  "keyValue": x.keyValue,
                  "value":this.authService.getNationalNumber(),
                }
              })
          };

          if(!service.serviceCard.shouldShow){
            this.disableConditionBtn=true;
            this.goStep2();
          }

          this.isLoading=false;
    
      });

    }
    else if(this.route.snapshot.queryParams['serviceId']){

      this.serviceId = this.route.snapshot.queryParamMap.get('serviceId')!;

      this.yourTurn=true;
      this.disableConditionBtn=true;

      this.doesFormGenerated=true;

      this.goStep2();

      const serviceName = this.route.snapshot.queryParamMap.get('serviceName');

      this.serviceName=serviceName??"-";

      this.GetStepForConsumer();
     
    }

    this.listenToVisibilityChange();

  }

  private applyForService(body: { serviceId: string | undefined; rootValues: { fieldId: any; keyValue: any; value: string | null; }[]; }) {

    this.isLoading=true;
    
    var request = this.apiService.post("carboncopies/applyforservice", body);
    request.subscribe(res => {

      if (res.statusCode == 200 && res.error == false) {
        this.serviceId = res.data;
        this.GetStepForConsumer();
        this.doesFormGenerated=true;
      }
    });
  }

  deleteContainer(event: any, showConfirmation = true) {
  
    var indexId = event.indexId;
    var containerId = event.containerId;

    if(showConfirmation){
      if (window.confirm("هل انت متأكد ؟")==false) {
        return;
      }
    }
  
    if (true) {
      const filterCondition = indexId
        ? (x: any) => x.containerId === containerId && x.id === indexId
        : (x: any) => x.containerId === containerId;
  
      const indexToDelete = this.containers.findIndex(filterCondition);
  
      const selectedContainer = this.containers.filter(filterCondition)[0];
  
      this.updateValidation();
  
      selectedContainer.containerFields.map((field: any) => {

        if (field.type === "CONTAINER") {
          this.deleteContainer({ containerId: field.id },false);
        }
        this.myForm.removeControl(field.id);

        
        try{
          this.calculate(field.id);
        }catch(ex){

        }
        
      });
  
      this.containers.splice(indexToDelete, 1);
      
      
    }

    
  }
  
  appendQueryString(url: string): string {
    const token = `Token=${this.authService.getToken()}`;

    if (url.includes('?')) {
        if (url.charAt(url.length - 1) === '&') {
            return url + token;
        } else {
            return url + '&' + token;
        }
    } else {
        return url + '?' + token;
    }
}

  calculate(fieldId:string) {

    const baseId = fieldId.replace(/#.*$/, '');

    const targetCalculation = this.getCalculationFields().find(x => x.equation?.fieldId === baseId);

    if (!targetCalculation) return;

    const targetValueControl = this.myForm?.get(targetCalculation.id);

    let accumulatedValue: number = 0;

    Object.keys(this.myForm!.controls).forEach(controlKey => {
        if (controlKey.startsWith(baseId)) {
            const controlValue = Number(this.myForm?.get(controlKey)?.value);
            if (targetCalculation.equation?.operation === "PLUS") {
                accumulatedValue += controlValue;
            } else {
                accumulatedValue -= controlValue;
            }
        }
    });

    targetValueControl?.setValue(accumulatedValue);
  }


  // deleteContainer(event:any) {

  //   console.log(this.containers);

  //   var indexId=event.indexId;
    
  //   var containerId= event.containerId;

  //   if (window.confirm("هل انت متأكد ؟")) {

  //     const indexToDelete = this.containers.findIndex(
  //       x => x.containerId === containerId && x.id === indexId
  //     );

  //     const selectedContainer = this.containers.filter(x => x.containerId === containerId && x.id== indexId)[0];

  //     this.updateValidation();

  //     selectedContainer.containerFields.map(field=>{

  //         if(field.type=="CONTAINER"){
  //           this.deleteContainer({containerId:field.id});
  //         }

  //         this.myForm.removeControl(field.id);
  //     });

  //     this.containers.splice(indexToDelete, 1);

  //   }

  //   // if (window.confirm("هل انت متأكد ؟")) {
  //   //   const indexToDelete = this.containers.filter(x => x.containerId === containerId)[indexId];
  
  //   //   if (indexToDelete !== null) {

  //   //     var selectedContainerItems=this.containers.filter(x=>x.containerId==containerId)[indexId];

  //   //     this.updateValidation();

  //   //     selectedContainerItems.containerFields.map(field=>{
  //   //       this.myForm.removeControl(field.id+`#${indexId}`);

  //   //     });

  //   //     this.containers.splice(indexToDelete, 1);
  //   //   }
  //   // }
  // }
  
  addContainerItems(event:any){


    if(event.field.sizeLimit!=null){

      var maxContainer=this.myForm.get(event.field.sizeLimit)?.value;


      if(this.containers.filter(x=>x.containerId==event.field.id).length>=maxContainer && maxContainer!=null){
        this.sweetAlertService.ShowAlert('error','وصلت الى الحد الاقصى');
        return;
      }

    }

    var container=event.field as Field;

    var updatedFields=this.updateContainerIds(_.cloneDeep(container));

    this.containers.push(new Container(this.containers.length+1,updatedFields.id,updatedFields.fields!,1));

    updatedFields.fields?.map(field=>{

      field.value=null;
      
      this.addField(field,field.id,'');

    });

    this.myForm.addControl(container.id, new FormControl(null));


  }


  GetStepForConsumer(){
    
    var request=this.apiService.get(`carboncopies/GetStepForConsumer?serviceId=${this.serviceId}`)
    request.subscribe(res=>{

      if(res.statusCode==200){

        this.currentSubmitButtonText=res.data.submitButtonText;

        this.generateField(res.data.fields,false);

        this.onParentChange(this.fields);
      }else{
        this.showSubmit=false;
      }

      this.isLoading=false;


    });


  }


  // private generateField(fields: any[],refresh:boolean) {
  //   var apiFields = fields as any[];

  //   apiFields.map(x => {
  //     const field = <Field>x;

  //     // if(field.editable==undefined || field.editable==null){
  //     //   field.editable=true;
  //     // }

  //     field.oldRequired=field.required;
  //     field.oldEditable=field.editable??true;
  //     field.oldHidden=field.hidden;
  //     field.oldModifiable=field.modifiable;
      
  //     this.fields.push(field);
  //     this.addField(field,field.id,field.value);
      
  //   });

  // }

  private generateField(fields: Field[], refresh: boolean): void {
    const backupFields = (field: Field) => {
        field.oldRequired = field.required;
        field.oldEditable = field.editable;
        field.oldHidden = field.hidden;
        field.oldModifiable = field.modifiable;
    };

    fields.forEach(field => {
        backupFields(field);
        if (field.type === "CONTAINER" && field.fields) {
            field.fields.forEach(backupFields);
        }
        
        this.fields.push(field);
        this.addField(field, field.id, field.value);
    });
  }

  private addField(field: Field,fieldId:string,value:any) {

    if (field.type == 'CHECBOX') {
      this.generateCheckbox(field,fieldId,value);
    }
    else if (field.type == 'PREDEFINED_COMBO_BOX') {
      this.generatePredefinedComboBox(field,fieldId,value);
    }
    else if (field.type == 'COMBO_BOX') {
      this.generateComboBox(field,fieldId,value);
    }
    else if ((field.type == 'TEXT_FIELD' && field.textFieldType=="date" )|| field.type=="DATE") {
      this.generateDate(field,fieldId,value);
    }
    else if (field.type == 'TEXT_FIELD') {
      this.generateTextField(field,fieldId,value);
    }
    else if (field.type == 'FILE') {
      this.generateFile(field,fieldId,value);
    }
    else if (field.type == 'EFAWATEERCOM') {

      this.generateEfawateercom(field);

    }
    else if (field.type == 'CONTAINER') {

      this.generateContainerV2(field,field.value);

    }
    else if (field.type == 'WEBVIEW') {

      //this.showSubmit=false;
      this.generateOther(field,fieldId,field.url);

    }
    else {
      this.generateOther(field,fieldId,value);
    }
  }



  generateContainerV2(container: Field,containerValue:any) {

    const containerValues = containerValue as any[] || [];

    const loops = containerValues.length > 0 ? containerValues.length : 1;

    for (let i = 0; i < loops; i++) {
      var updatedContainer= this.updateContainerIds(container);

      this.containers.push(new Container(this.containers.length+1,updatedContainer.id,updatedContainer.fields!,1));

      const currentLoopValue = containerValues[i] as any[] || [];

      updatedContainer.fields?.map(field=>{

        const newFieldId = this.getBaisFieldName(field);

        const value = currentLoopValue.find((value) => value.fieldId === newFieldId)?.value || null;
      
        if(field.type=="CONTAINER"){
          this.generateContainerV2(field,value);
        }else{
          this.addField(field,field.id,value??"");
        }

      });
  
      this.myForm.addControl(updatedContainer.id, new FormControl(null));

    }
  }


  getBaisFieldName(field:Field):string{
    const index = field.id.indexOf("#");
    const newFieldId = index !== -1 ? field.id.slice(0, index) : field.id; 

    return newFieldId;
  }

  updateContainerIds(container:Field): Field {

    const clonedContainer = _.cloneDeep(container); 

    clonedContainer.fields?.map(field=>{

      var randomText = Math.floor(Math.random() * 10000000000000).toString();

      var newId =field.id+"#"+randomText;

      clonedContainer.fields?.forEach(pf => {
        if (pf.parent) {
          this.updateFieldIdInCondition(pf.parent.condition, field.id, newId);
        }
      });

      field.id=newId;


      if(field.fields){
        this.updateContainerIds(field);
      }

    });

    return clonedContainer;

  }

  
  updateFieldIdInCondition(condition: any, oldId: string, newId: string) {
    if (condition) {
      if (condition.type === "OPERATION") {
        // Recursively update left and right sides
        this.updateFieldIdInCondition(condition.left, oldId, newId);
        this.updateFieldIdInCondition(condition.right, oldId, newId);
      } else if (condition.type === "UI" && condition.fieldId === oldId) {
        // Update the fieldId if it matches
        condition.fieldId = newId;
      }
    }
  }

  getCalculationFields():Field[]{
    var fields=this.fields.filter(x=>x.type=="CALCULATION");

    return fields;
  }


  private generateEfawateercom(field: Field) {
    var fields = field.fields!;

    this.payment = true;
    this.disableConditionBtn=true;
    this.goStep2();

    this.myForm.addControl(field.id, new FormControl(field.value ?? ""));

    fields.forEach(field => {

      this.myForm.addControl(field.id, new FormControl(field.value ?? ""));

    });

  }

  private generateFile(field: Field,fieldId:string,value:any[]|null) {


    this.myForm.addControl(fieldId, new FormControl());

    if(value!=null){
      var files=value as any[];
  
      if(files.length>0){
        files.map(file=>{
          this.pubshFile(fieldId,file,"",file);
        });
      }
    }
  }

  private generateComboBox(field: Field,fieldId:string,value:any) {
    this.myForm.addControl(fieldId, new FormControl(value ?? null));
  }

  private generateTextField(field: Field,fieldId:string,value:any) {

    this.myForm.addControl(fieldId, new FormControl(value ?? null));
  }

  private generateOther(field: Field,fieldId:string,value:any) {
    this.myForm.addControl(fieldId, new FormControl(value ?? null));
  }

  generateDate(field: any, fieldId: string, value: string) {
    let formattedValue = "";
  
    // A helper function to try different date formats
    const parseDate = (dateStr: string): Date | null => {
      // Try ISO format first (yyyy-mm-dd)
      let date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
  
      // Try dd/mm/yyyy format
      const parts = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (parts) {
        date = new Date(+parts[3], +parts[2] - 1, +parts[1]);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
  
      // Add additional date format checks if necessary
  
      return null; // If no format matches
    };
  
    // Check if value is not null or empty
    if (value) {
      const dateObject = parseDate(value);
  
      // If a valid date object is returned
      if (dateObject) {
        // Extract the date components
        const year = dateObject.getFullYear();
        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObject.getDate().toString().padStart(2, '0');
        formattedValue = `${year}-${month}-${day}`;
      } else {
        console.error('Invalid date format:', value);
      }
    }
  
    console.log(formattedValue);
  
    // Assuming this.myForm is already defined and is of a type that has addControl method
    this.myForm.addControl(fieldId, new FormControl(formattedValue));
  }
  
  

  private generatePredefinedComboBox(field: Field,fieldId:string,value:any) {
    this.myForm.addControl(fieldId, new FormControl(value ?? null));
  }

  private generateCheckbox(field: Field,fieldId:string,value:any) {
    this.myForm.addControl(fieldId, new FormControl(Boolean(value)));
  }

  

  Save() {

    this.submitted = true;

    if(this.route.snapshot.queryParams['serviceId'] && this.payment==true){
      var body={
        "serviceId": this.serviceId,
        "status": true
      }

      var request=this.apiService.post('carboncopies/CompletePaymentProcess', body);

      request.subscribe(res=>{
        if(res.statusCode==200){
          this.sweetAlertService.ShowAlertThenRedirect('success', res.message ?? "paymet success", '/Investment/Dashboard');
        }
      })

      return;

    }
    
    if (this.myForm.valid) {
      this.submitted = false;
      this.isLoading = true;
  
      const formValues = this.getFormValues();
  
      const body = {
        userId: this.authService.getNationalNumber(),
        serviceId: `${this.serviceId}`,
        values: formValues,
      };

      this.apiService.post('carboncopies/PostDataForConsumer', body)
        .subscribe(response => {
          const data = response.data;
  
          if (response.statusCode === 200) {
            this.isLoading = false;
            this.showSubmit=true;

  
            if (data.continue === false) {

              this.message=response.message;
              //$("#exampleModalBtn").click();

              this.sweetAlertService.ShowAlertThenRedirect('success', response.message, '/Investment/Dashboard');
            } else {
              this.removeFormControls();
              this.GetStepForConsumer();
            }
          }
          else{

            this.isLoading = false;
            //this.showSubmit=false;

            this.sweetAlertService.ShowAlert('error',response.message);

          }
        });
    } else {      

      this.myForm.markAllAsTouched();
      
      setTimeout(() => {
        try{
          this.scrollToFirstInvalidControl();

        }catch(ex){

        }
      }, 200);

      console.log(this.myForm);
    }
  }

  updateValidation(): void {
    Object.keys(this.myForm.controls).forEach(controlName => {
      const control = this.myForm.controls[controlName];
      control.markAsUntouched();
      control.updateValueAndValidity();
    });
  }

  validateCheckbox(control: AbstractControl): ValidationErrors | null {

    if (control.value === true) {
    
      return null; // Checkbox is checked, no error
    } else {
      return { checkboxRequired: true }; // Checkbox is not checked, return an error
    }
  }

  hasRequiredValidator(controlName: string): boolean {
    const control = this.myForm.get(controlName);
    if (control) {
      const validators = control.validator && control.validator({} as AbstractControl);
      return validators ? validators.hasOwnProperty('required') : false;
    }
    return false;
  }

  getFormControl(fieldId: string): FormControl | null {
    const control = this.myForm.get(fieldId);
    if (control instanceof FormControl) {
      return control;
    }
    return null;
  }

  getFormControlErrors(fieldId: string): ValidationErrors {
    const control = this.myForm.get(fieldId);
    return control?.errors!;
  }

  getFormControlValidation(fieldId: string): boolean {
    const control = this.myForm.get(fieldId);
    return control?.invalid!;
  }

  
  getFormValues(): formBody[] {
    const formValues: formBody[] = [];
    const controls = this.myForm.controls;
  
    Object.keys(controls).forEach(key => {
      if (!/#\d+$/.test(key)) {
        const field = this.fields.find(x => x.id === key);
  
        if (field) {
          const controlValue = this.getControlValue(field);
          formValues.push(new formBody(controlValue.fieldType!, key, controlValue.filedValue ?? ''));
        }
      }
    });
  
    return formValues;
  }
  
  getControlValue(field: Field): FieldInfo {

    const control = this.myForm.get(field.id);
    let controlValue = null;

    var fieldType="STRING";
  
    switch (field.type) {

      case 'TEXT_FIELD':
        controlValue = String(control!.value);
        break;

      case 'CALCULATION':
        controlValue = String(control!.value);
        break;

      case 'TEXT_FIELD_PHONE':

        var phone=control!.value as any;

        if(phone!=null){
          this.phoneDto=phone;
          controlValue = String(phone.e164Number);
        }else{
          controlValue="";
        }

        break;

      case 'MULTI_COMBO_BOX':

        controlValue = control!.value as any[];

        fieldType="LIST_OF_STRING";

        break;

      case 'MULTI_PREDEFINED_COMBO_BOX':

        controlValue = control!.value as any[];

        fieldType="LIST_OF_STRING";

        break;

      case 'FILE':

        controlValue = this.getFileValue(field.id) as any[]|null;

        fieldType="FILE";

        break;
      case 'CHECKBOX':

        controlValue = this.checkCbValue(field.id);
        fieldType="BOOLEAN";

        break;
      
        case 'WEBVIEW':

        controlValue = field.url;

        break;
      case 'CONTAINER':

        controlValue = this.getContainerValue(field);
        fieldType="CONTAINER";

        break;

      default:
        controlValue = control!.value;
    }
  
    return new FieldInfo(controlValue,fieldType);
  }
  
  getFileValue(fieldId: string): string[] {
    const filesBase64: string[] = this.files
      .filter(file => file.controlName === fieldId)
      .map(file => file.objectId);
  
    return filesBase64;
  }

  setPhoneObject(phoneObj:any){
    console.log(phoneObj);
  }

  goToUrl(url:string){
    window.open(url, '_blank');
  }

  
  getContainerValue(field: Field): formBody[][] {
    const containerItems = this.containers.filter(x => x.containerId === field.id);
    const containerValue: formBody[][] = [];
  
    containerItems.forEach(containerItem => {
      const fields: formBody[] = [];
  
      containerItem.containerFields.forEach(field => {
        var formField = this.myForm.get(`${field.id}`);

        let fieldType = this.getFieldType(field.type);
  
        let fieldValue: any;
  
        switch (field.type) {
          case 'MULTI_COMBO_BOX':

            fieldType = "LIST_OF_STRING";
            fieldValue = formField?.value;
            
            break;

          case 'CONTAINER':

          fieldType = "CONTAINER";
          fieldValue=this.getContainerValue(field);

          break;

           case 'TEXT_FIELD_PHONE':

            var phone=formField?.value as any;
    
            if(phone!=null){
              this.phoneDto=phone;
              fieldValue = String(phone.e164Number);
            }else{
              fieldValue="";
            }
    
            break;
              
          case 'CHECKBOX':
            fieldType = "BOOLEAN";
            fieldValue = this.checkCbValue(field.id);
            break;
          case 'FILE':
            fieldType = "FILE";
            fieldValue = this.getFileValue(`${field.id}`);
            break;
          // Add more cases for other field types if needed
          default:
            fieldValue = formField?.value;
        }
  
        const newFieldId = this.getBaisFieldName(field);

        fields.push(new formBody(fieldType, newFieldId, fieldValue));
      });
  
      containerValue.push([...fields]);
    });
  
    return containerValue;
  }  

  getFieldType(basicType:string):string{

    
    switch (basicType) {

      case 'TEXT_FIELD':

        return 'STRING';

      case 'MULTI_COMBO_BOX':

        return "LIST_OF_STRING";

      case 'FILE':

        return "FILE";

      case 'CHECKBOX':

        return "BOOLEAN";

      case 'CONTAINER':

        return "CONTAINER";

      default:

        return 'STRING';

    }
  }

  private removeFormControls() {
    Object.keys(this.myForm.controls).forEach(controlName => {
      this.isLoading = true;
      this.fields = [];
      this.myForm.removeControl(controlName);
    });

    this.containers=[];
    this.files=[];

  }


  checkCbValue(key:string):boolean{

    if(this.myForm.get(key)?.value ==null || this.myForm.get(key)?.value ==''){
      return false;
    }else{
      return true;
    }

  }

  listenToVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        var webViewField=this.fields.filter(x=>x.type=="WEBVIEW")[0];

        if(webViewField){

          var body={
            fieldId:webViewField.id,
            shouldRefresh:true,
            isContainer:false,
            containerFieldId:undefined,
            fieldIndex:undefined
          }

          this.refreshForm(body);

        }
      }
    });

  }

  refreshForm(event:any): void {

    if (event.shouldRefresh) {
      this.isLoading = true;
  
      const formValues = this.getFormValues();
  
      const filteredFormValues = formValues.filter(x => x.value !== null && x.value !== undefined && x.value !== "" && x.value !== "null");
  
      if(event?.fieldId){

        const index = event?.fieldId.indexOf("#");
        const newFieldId = index !== -1 ? event?.fieldId.slice(0, index) : event?.fieldId; 

        event.fieldId = newFieldId;
      }

      const body = {
        userId: this.authService.getNationalNumber(),
        serviceId: this.serviceId,
        fieldId: event.isContainer==true? event.containerFieldId :event.fieldId,
        containerFieldId : event.isContainer==true ? event.fieldId :undefined ,
        fieldIndex:event.fieldIndex!=undefined?event.fieldIndex:null,
        values: filteredFormValues,
      };
  
      this.apiService.post('carboncopies/RefreshStep', body).subscribe(
        (res: any) => {
  
          if (res.statusCode === 200) {

            this.showSubmit=true;

            this.removeFormControls();

            this.generateField(res.data.fields, true);
            
          } else {

            this.showSubmit=false;

            //alert(res.message);
          }
  
          this.isLoading = false;
          this.onParentChange(this.fields);

        },
        (error: any) => {
          this.isLoading = false;
          console.error('Error refreshing form:', error);
        }
      );
    } else {
      this.onParentChange(this.fields);
    }


  }

  
  onParentChange(fields:Field[],doContainer:boolean=true): void {

    this.updateValidation();
    
    fields.filter((field) => field.parent != null).map((field) => {
      const data = this.getConditionType(field.parent!.condition);


      if (data === true) {
        field.hidden = field.parent?.hidden;
        field.required = field.parent?.required!;
        field.editable = field.parent?.editable;

        if(field.type=="CONTAINER"){
          field.modifiable=field.parent?.editable;
        }
        
      } else {
        field.hidden = field.oldHidden;
        field.required = field.oldRequired!;
        field.editable = field.oldEditable!;

        if(field.type=="CONTAINER"){
          field.modifiable = field.oldModifiable!;
        }

      }

      if( field.editable ==false){
        this.myForm.get(field.id)?.disable();
      }else if(field.editable ==true){
        this.myForm.get(field.id)?.enable();
      }



    });


    if(doContainer){
      this.containers.map(container=>{
        this.onParentChange(container.containerFields,false);
      });
    }

  }

  
  getConditionType(condition: any): any {

    switch (condition.type) {
      case ConditionType.Operation:
        return this.conditionLogicOperation(condition);
      case ConditionType.Input:
        return this.inputLogicOperation(condition);
      case ConditionType.UI:
        return this.uiLogicOperation(condition);
      default:
        return false;
    }
  }

  conditionLogicOperation(data:any):boolean{

    var right=this.getConditionType(data.right);
    var left=this.getConditionType(data.left);

    switch (data.operation) {
      case "AND":
        return right && left;
      case "OR":
        return right || left;
      case "EQUAL":

        return right == left;

      case "NOT_EQUAL":
        
      return right != left;

      case "GREATER_THAN":
          return left >= right;
        case "GREATER":
          return left > right;
        case "LESS_THAN":
          return left <= right;
        case "LESS":
          return left < right;

        case "CONTAINS":

          var lestString= left as string;

          var rightString= right as string;
        
          return containsString(lestString,rightString);
          
      default:
        return false;
    }

    function containsString(str1: string, str2: string): boolean {
      return str1.includes(str2);
    }

  }



  inputLogicOperation(conditionLogicInput:any):any{

    switch (conditionLogicInput.inputType) {
      case "integer":
        return parseInt(conditionLogicInput.input);
      case "number":
        return parseFloat(conditionLogicInput.input);
      case "boolean":
        return conditionLogicInput.input.toLowerCase() === 'true';
      case "string":
        return conditionLogicInput.input;
      default:
        return conditionLogicInput.input;
    }

  }

  uiLogicOperation(conditionLogicUI:any):any{
    
    var controlValue=this.myForm.get(conditionLogicUI.fieldId!);


    return controlValue?.value;
  }

  GetContainerItems(containerId:string):Container[]{

    var container=this.containers.filter(x=>x.containerId==containerId);

    return container;
  }

  onUploadFile(event:any) {

    this.showSubmit=false;

    var controlName=event.fieldId;
    var event=event.event;
    var multi=event.multi as boolean;

    if (multi === false && this.getFiles(controlName).length > 0) {
      this.sweetAlertService.ShowAlert('error', 'you can upload 1 file only');
      return;
    }


    var files=event.target.files as any[];

    for(var i=0;i<files.length;i++){

      this.uploadFileAndGetObjectName(files[i]).subscribe(response=>{
        

        var objectName: string = response;

        this.showSubmit=true;


        if(objectName==null || objectName=="" ){
          this.sweetAlertService.ShowAlert('error','يرجى تحميل الملف مرة اخرى');
          return;
        }

        this.pubshFile(controlName, "", "", objectName);

        // const reader = new FileReader();
        // const file = event.target.files[0];
        // reader.readAsDataURL(file);
      
        // reader.onload = () => {
        //   const base64String = reader.result as string;
        //   const base64WithoutPrefix = base64String?.substring(base64String.indexOf(',') + 1);
        //   this.pubshFile(controlName, base64WithoutPrefix, file, objectName);
        // };

      });

    }

    event.target.value = '';

  }
  
  // async uploadFileAndGetObjectName(file: any): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     this.apiService.uploadFile(file, this.serviceId!).subscribe(
  //       (response: any) => {
  //         const objectName = response.data.objectName;
  //         resolve(objectName);
  //       },
  //       (error: any) => {
  //         return "";
  //       }
  //     );
  //   });
  // }
  
  uploadFileAndGetObjectName(file: any): Observable<string> {
    return this.apiService.uploadFile(file, this.serviceId!).pipe(
      map((response: any) => response.data.path)
    );
  }

  private pubshFile(controlName: string, base64WithoutPrefix: string, fileName: string,objectName:string) {
    this.files.push(new FileModel(this.files.length + 1, controlName, base64WithoutPrefix, fileName,objectName));
  }

  getFiles(controlName:string):FileModel[]{
    return this.files.filter(x=>x.controlName==controlName);
  }

  getAllFiles():FileModel[]{
    return this.files;
  }

  deleteFile(event:any){

    var fileId=event.fieldId;

    if (window.confirm("هل انت متأكد ؟")) {

      var fieldName=this.files.filter(x=>x.id==fileId)[0];

      this.myForm.get(fieldName.controlName)?.setValue(null);

      this.files=this.files.filter(x=>x.id!=fileId);

    }
  }

}
