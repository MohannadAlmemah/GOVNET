import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/apiService';
import { SweetAlertService } from 'src/services/sweetAlertService';
import { Field } from '../models/field';
import {Container} from '../models/ContainerField';
import { formBody } from '../models/formBody';
import { FileModel } from '../models/file';
import {ConditionType} from '../models/enum/conditionType';
import { AuthService } from 'src/services/auth.service';
import { saveAs } from 'file-saver';

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


  private scrollToFirstInvalidControl() {
    let firstInvalidControl = $("input.is-invalid,select.is-invalid")[0];
    firstInvalidControl.scrollIntoView();
    (firstInvalidControl as HTMLElement).focus();
  }

  //9861049531
  constructor(private apiService:ApiService,private route: ActivatedRoute, private el: ElementRef,
    private sweetAlertService:SweetAlertService,private authService:AuthService
    ) {
    this.myForm=new UntypedFormGroup({});
    this.files=[];
    this.fields=[];
    
  }

  goStep1(){
    this.showStep="1";
  }

  goStep2(){
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

  allowedExtension(mediaType: string, allowedExtension: string[]|undefined): string[] {

    if (mediaType === 'ANY') {
      return ['*']; // Allow all file types (wildcard)
    } else if (mediaType === 'MEDIA') {
      return ['.mp3', '.mp4', '.avi']; // Add the media extensions you want to allow
    } else if (mediaType === 'IMAGE') {
      return ['.jpg', '.jpeg', '.png', '.gif']; // Add the image extensions you want to allow
    } else if (mediaType === 'VIDEO') {
      return ['.mp4', '.avi', '.mov']; // Add the video extensions you want to allow
    } else if (mediaType === 'AUDIO') {
      return ['.mp3', '.wav']; // Add the audio extensions you want to allow
    } else if (mediaType === 'CUSTOM') {
      return allowedExtension!; // Use the provided custom extensions
    } else {
      return []; // Return an empty array for unknown media types
    }
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

      this.onParentChange();

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
  
      this.onParentChange();
  
      this.disableFormControls(this.myForm);
  
      this.isLoading=false;
    }
  }

  goBack(){

    this.currentIndex>0? this.currentIndex--:this.currentIndex;

    if(this.currentIndex>=0){

      this.removeFormControls();
      
      this.generateField(this.steps[this.currentIndex]?.fields,false);
  
      this.onParentChange();
  
      this.disableFormControls(this.myForm);
  
      this.isLoading=false;
      }
  }

  downloadFile(fileName:string,data: any,fileFormat:string): void {
    const linkSource = 'data:'+fileFormat+';base64,'+data;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  downloadMinioFile(objectId:string){
    var request=this.apiService.get(`Minio/GetFile?ObjectName=${objectId}`);
    request.subscribe(response=>{

      this.downloadFile(response.data?.objectstat?.objectName,response.data.data,response.data?.objectstat?.contentType);

    })
  }



  ngOnInit(): void {


    if (this.route.snapshot.queryParams['serviceId'] && this.route.snapshot.queryParams['showForm']) {

      this.serviceId= this.route.snapshot.queryParams['serviceId'];
      this.serviceType= this.route.snapshot.queryParams['serviceType'];

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

        if(!service.serviceCard.shouldShow){
          this.disableConditionBtn=true;
          this.goStep2();
        }
  
        var rootValues=service.rootValues as any[];
  
          var body={
            "serviceId": this.BluePrintId,
              "rootValues": rootValues.map(x=>{
                return{
                  "fieldId": x.fieldId,
                  "keyValue": x.keyValue,
                  "value":this.authService.getNationalNumber(),
                }
              })
          };
  
        var request=this.apiService.post("carboncopies/applyforservice",body);
        request.subscribe(res=>{
          
          if(res.statusCode==200 && res.error==false){
            this.serviceId=res.data;
            this.GetStepForConsumer();
          }
        });
  
      });

    }
    else if(this.route.snapshot.queryParams['serviceId']){

      this.serviceId = this.route.snapshot.queryParamMap.get('serviceId')!;

      this.yourTurn=true;
      this.disableConditionBtn=true;
      this.goStep2();

      const serviceName = this.route.snapshot.queryParamMap.get('serviceName');

      this.serviceName=serviceName??"-";

      this.GetStepForConsumer();
     
    }

  }

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

  deleteContainer(indexId: number, containerId: string) {

    if (window.confirm("هل انت متأكد ؟")) {
      const indexToDelete = this.containers.findIndex(
        x => x.containerId === containerId && x.index === indexId
      );
  
      if (indexToDelete !== -1) {

        var selectedContainerItems=this.containers.filter(x=>x.containerId==containerId && x.index==indexId)[0];

        this.updateValidation();

        selectedContainerItems.containerFields.map(field=>{
          console.log(field.id+`#${indexId}`);
          this.myForm.removeControl(field.id+`#${indexId}`);
        });

        this.containers.splice(indexToDelete, 1);
      }


      // Object.keys(this.myForm.controls).forEach(controlName => {
        
      //   if (controlName.startsWith(containerId) && controlName.endsWith(`#${indexId}`)) {
      //     this.myForm.removeControl(controlName);
      //   }else{
      //   }
      // });


    }
  }

  addContainerItems(containerUi:Field){

    var containerId=containerUi.id;

    if(this.containers.length>0){
      var maxIndex=Math.max(...this.containers.filter(y=>y.containerId==containerId).map(item => item.index));
  
      var container=this.containers.filter(x=>x.containerId==containerId)[0];
  
      this.containers.push(new Container(containerId,container.containerFields,maxIndex+1));
  
      container.containerFields.map(containerField=>{
        this.myForm.addControl(containerField.id+`#${maxIndex+1}`,new FormControl(null));
      });
    }

  }


  generateContainer(containerUI:Field){

    this.myForm.addControl(containerUI.id, new FormControl(""));
    

    var fieldValuesArr=containerUI.value as any[];

    if(fieldValuesArr.length>0){

      fieldValuesArr.map((fieldValue,fieldValueindex)=>{

        var index=this.containers.filter(x=>x.containerId==containerUI.id).length+1;

        this.containers.push(new Container(containerUI.id,containerUI.fields!,index));

        var fieldValueItems=fieldValue as any[];

        fieldValueItems.map(item=>{

          containerUI.fields?.map((fieled)=>{

            if(item.fieldId==fieled.id){

              this.addField(fieled,fieled.id+`#${index}`,item.value);
            }

          });


        })


      });

    }else{


      var containerFields = containerUI.fields;

      this.containers?.push(new Container(containerUI.id, containerFields!, 1));
  
      containerFields!.forEach((containerField) => {

  
        this.addField(containerField,containerField.id+"#1",containerField.value);
        
      });
  
      this.myForm.addControl(containerUI.id, new FormControl(containerUI.value ?? ""));

    }

  }

  GetStepForConsumer(){
    
    var request=this.apiService.get(`carboncopies/GetStepForConsumer?serviceId=${this.serviceId}`)
    request.subscribe(res=>{

      if(res.statusCode==200){

        this.generateField(res.data.fields,false);
        this.onParentChange();

        this.isLoading=false;
      }else{
        this.isLoading=false;
        //alert(res.message);
      }

    });

  }

  private generateField(fields: any[],refresh:boolean) {
    var apiFields = fields as any[];

    apiFields.map(x => {
      const field = <Field>x;

      field.oldRequired=field.required;
      field.oldEditable=field.editable;
      field.oldHidden=field.hidden;
      field.oldModifiable=field.modifiable;
      
      this.fields.push(field);
    });

    this.fields.map(field => {
      this.addField(field,field.id,field.value);
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

      this.generateContainer(field);

    }
    else if (field.type == 'WEBVIEW') {

      //this.showSubmit=false;
      this.generateOther(field,fieldId,field.value);

    }
    else {
      this.generateOther(field,fieldId,value);
    }
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

    var x=this.myForm.get('') as FormControl;
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
            this.showSubmit=true;

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
      // Mark the control as untouched and update its validity
      control.markAsUntouched();
      control.updateValueAndValidity();
    });
  }

  validateCheckbox(control: AbstractControl): ValidationErrors | null {

    console.log('checkbox');

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

      case 'FILE':

        controlValue = this.getFileValue(field.id) as any[]|null;

        fieldType="FILE";

        break;
      case 'CHECKBOX':

        controlValue = this.checkCbValue(field.id);
        fieldType="BOOLEAN";

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
        const formField = this.myForm.get(`${field.id}#${containerItem.index}`);
        let fieldType = this.getFieldType(field.type);
  
        let fieldValue: any;
  
        switch (field.type) {
          case 'MULTI_COMBO_BOX':

            fieldType = "LIST_OF_STRING";
            fieldValue = formField?.value;
            
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
            fieldValue = this.getFileValue(`${field.id}#${containerItem.index}`);
            break;
          // Add more cases for other field types if needed
          default:
            fieldValue = formField?.value;
        }
  
        fields.push(new formBody(fieldType, field.id, fieldValue));
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


  // refreshForm(fieldId: string, shouldRefresh: boolean): void {

  //   if (shouldRefresh) {
  //     this.isLoading = true;
  
  //     const formValues = this.getFormValues();
  
  //     const filteredFormValues = formValues.filter(x => x.value !== null && x.value !== undefined && x.value !== "" && x.value !== "null");
  
  //     const body = {
  //       serviceId: this.serviceId,
  //       fieldId,
  //       values: filteredFormValues,
  //     };
  
  //     this.apiService.post('carboncopies/RefreshStep', body).subscribe(
  //       (res: any) => {
  
  //         if (res.statusCode === 200) {
  //           this.removeFormControls();

  //           this.generateField(res.data.fields, true);
            
  //         } else {

  //           //alert(res.message);
  //         }
  
  //         this.isLoading = false;
  //         this.onParentChange();

  //       },
  //       (error: any) => {
  //         this.isLoading = false;
  //         console.error('Error refreshing form:', error);
  //       }
  //     );
  //   } else {
  //     this.onParentChange();
  //   }
  // }

  refreshForm2(event:any): void {

    if (event.shouldRefresh) {
      this.isLoading = true;
  
      const formValues = this.getFormValues();
  
      const filteredFormValues = formValues.filter(x => x.value !== null && x.value !== undefined && x.value !== "" && x.value !== "null");
  
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
          this.onParentChange();

        },
        (error: any) => {
          this.isLoading = false;
          console.error('Error refreshing form:', error);
        }
      );
    } else {
      this.onParentChange();
    }
  }

  
  onParentChange(): void {

    this.updateValidation();
    
    this.fields.filter((field) => field.parent != null).map((field) => {
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

    });
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

  //good code
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

      default:
        return false;
    }
  }

//good code
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

//good code
  uiLogicOperation(conditionLogicUI:any):any{
    
    var controlValue=this.myForm.get(conditionLogicUI.fieldId!);


    return controlValue?.value;
  }

  GetContainerItems(containerId:string):Container[]{

    var filterdContainer=this.containers.filter(x=>x.containerId==containerId);
    return filterdContainer;
  }

  async onUploadFile(controlName: string, event: any, multi: boolean) {

    if (multi === false && this.getFiles(controlName).length > 0) {
      this.sweetAlertService.ShowAlert('error', 'you can upload 1 file only');
      return;
    }


    var files=event.target.files as any[];

    for(var i=0;i<files.length;i++){
      var objectName: string = await this.uploadFileAndGetObjectName(files[i]);

      if(objectName==null || objectName=="" ){
        this.sweetAlertService.ShowAlert('error','يرجى تحميل الملف مرة اخرى');
        return;
      }

      const reader = new FileReader();
      const file = event.target.files[0];
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64WithoutPrefix = base64String?.substring(base64String.indexOf(',') + 1);
        this.pubshFile(controlName, base64WithoutPrefix, file, objectName);
      };

    }

    event.target.value = '';

  }
  
  async uploadFileAndGetObjectName(file: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.apiService.uploadFile(file, this.serviceId!).subscribe(
        (response: any) => {
          const objectName = response.data.objectName;
          resolve(objectName);
        },
        (error: any) => {
          return "";
        }
      );
    });
  }
  
  private pubshFile(controlName: string, base64WithoutPrefix: string, fileName: string,objectName:string) {
    this.files.push(new FileModel(this.files.length + 1, controlName, base64WithoutPrefix, fileName,objectName));
  }

  getFiles(controlName:string):FileModel[]{
    return this.files.filter(x=>x.controlName==controlName);
  }

  deleteFile(fileId:number){
    if (window.confirm("هل انت متأكد ؟")) {
      this.files=this.files.filter(x=>x.id!=fileId);
    }
  }

}
