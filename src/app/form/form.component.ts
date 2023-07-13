import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/apiService';
import { SweetAlertService } from 'src/services/sweetAlertService';
import { Field } from '../models/field';
import {Container} from '../models/ContainerField';
import { formBody } from '../models/formBody';
import { FileModel } from '../models/file';


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
  styleUrls: ['./form.component.css']
})


export class FormComponent implements OnInit {

  @ViewChild('myPond') myPond: any;

  fields:Field[];

  myForm:UntypedFormGroup; 
  files:FileModel[];
  serviceId:string|undefined;
  BluePrintId:string|undefined;
  isLoading=true;
  pondFiles: string[] = [];
  service:any;
  nationalId:string="9831025503";
  submitted = false;
  currentIndex=0;
  containers:Container[]=[];
  //9861049531
  constructor(private apiService:ApiService,private route: ActivatedRoute,
    private sweetAlertService:SweetAlertService
    ) {
    this.myForm=new UntypedFormGroup({});
    this.files=[];
    this.fields=[];
    
  }

  onUploadFile(controlName:string,event:any){

    const reader = new FileReader();
    var file=event.target.files[0];
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64String = reader.result as string;

      const base64WithoutPrefix = base64String?.substring(base64String.indexOf(',') + 1);

      this.files.push(new FileModel(this.files.length+1,controlName,base64WithoutPrefix,file.name));

    };

    console.log(this.files);

  }

  GetContainerItems(containerId:string):Container[]{
    var filterdContainer=this.containers.filter(x=>x.containerId==containerId);
    return filterdContainer;
  }

  getFiles(controlName:string):FileModel[]{
    return this.files.filter(x=>x.controlName==controlName);
  }

  deleteFile(fileId:number){
    this.files=this.files.filter(x=>x.id!=fileId);
  }

  ngOnInit(): void {

    if (this.route.snapshot.queryParams['BluePrintId']) {

      const bluePrintId = this.route.snapshot.queryParamMap.get('BluePrintId');

      var sectionId = this.route.snapshot.queryParamMap.get('SectionId');

      if(bluePrintId!=null && sectionId!=null){

        this.BluePrintId=bluePrintId;

      }
    }

    var Services=this.apiService.get('categorization/GetServicesWithSectionId?id='+sectionId!);

    Services.subscribe(response=>{

      var data=response.data as any[];

      var service=data.filter(x=>x.id==this.BluePrintId)[0];

      var rootValues=service.rootValues as any[];

        var body={
          "serviceId": this.BluePrintId,
            "rootValues": rootValues.map(x=>{
              return{
                "fieldId": x.fieldId,
                "keyValue": x.keyValue,
                "value": this.nationalId
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

    console.log(this.myForm);

  }

  addContainerItems(containerId:string){

    var maxIndex=Math.max(...this.containers.filter(y=>y.containerId==containerId).map(item => item.index));

    var container=this.containers.filter(x=>x.containerId==containerId && x.index==1)[0];

    this.containers.push(new Container(containerId,container.containerFields,maxIndex+1));

    container.containerFields.map(containerField=>{
      this.myForm.addControl(containerField.id+`#${maxIndex+1}`,new FormControl(containerField.value??""));
    });

  }

  GetStepForConsumer(){
    var request=this.apiService.get(`carboncopies/GetStepForConsumer?userId=${this.nationalId}&serviceId=${this.serviceId}`)
    request.subscribe(res=>{

      if(res.statusCode==200){
        var apiFields=res.data.fields as any[];

        apiFields.map( x =>{
          const field = <Field>x;
          this.fields.push(field);
        });

  
        this.fields.map(field=>{
          if(field.type=='CHECBOX'){
            this.myForm.addControl(field.id,new FormControl(Boolean(field.value)));
          }
          else if(field.type=='PREDEFINED_COMBO_BOX'){
            this.myForm.addControl(field.id,new FormControl(field.value??""));
          }
          else if(field.type=='COMBO_BOX'){
            this.myForm.addControl(field.id,new FormControl(field.value??""));
          }
          else if(field.type=='CONTAINER'){

            var containerFields=field.fields as any[];

            this.containers?.push(new Container(field.id,containerFields,1));

            containerFields.forEach((containerField)  => {
      
              var controlName=containerField.id+"#1";

              this.myForm.addControl(controlName,new FormControl(containerField.value??""));
            });

            this.myForm.addControl(field.id,new FormControl(field.value??""));
          }

          else{
            this.myForm.addControl(field.id,new FormControl(field.value));
          }
          
        });
  
        this.isLoading=false;
      }else{
        this.isLoading=false;
        alert(res.message);
      }

    });

    console.log(this.myForm);

  }

  Save() {
    this.submitted = true;
    debugger
    if (this.myForm.valid) {
      this.submitted = false;
      this.isLoading = true;
  
      const formValues = this.getFormValues();
  
      const body = {
        userId: this.nationalId,
        serviceId: `${this.serviceId}`,
        values: formValues,
      };
  
      this.apiService.post('carboncopies/PostDataForConsumer', body)
        .subscribe(response => {
          const data = response.data;
  
          if (response.statusCode === 200) {
            this.isLoading = false;
  
            if (data.continue === false) {
              this.sweetAlertService.ShowAlertThenRedirect('success', response.message, '/');
            } else {
              this.removeFormControls();
              this.GetStepForConsumer();
            }
          }
  
          console.log(response);
        });
    } else {
      console.log(this.myForm);
    }
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

      case 'FILE':

        controlValue = this.getFileValue(field);
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
  
  getFileValue(field: Field): any[] | null {
    const file = this.files.find(x => x.controlName === field.id);
    return file ? [file.fileBase64 ?? null] : [];
  }
  
  getContainerValue(field: Field): any[] {
    const containerItems = this.containers.filter(x => x.containerId === field.id);
    const containerValue: any[] = [];
  
    containerItems.forEach(containerItem => {
      const fields: formBody[] = [];
  
      containerItem.containerFields.forEach(field => {
        const formField = this.myForm.get(`${field.id}#${containerItem.index}`);


        var fieldType=this.getFieldType(field.type);
  
        switch (field.type) {

          case 'TEXT_FIELD':
            break;

          case 'FILE':

            fieldType="FILE";

            break;
          case 'CHECKBOX':

            fieldType="BOOLEAN";

            break;
          case 'CONTAINER':

            fieldType="CONTAINER";

            break;
          default:
        }

        const fieldValue = field.type === 'CHECKBOX' ? this.checkCbValue(field.id) : formField?.value;

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
  }


  checkCbValue(key:string):boolean{

    if(this.myForm.get(key)?.value ==null || this.myForm.get(key)?.value ==''){
      return false;
    }else{
      return true;
    }

  }



}
