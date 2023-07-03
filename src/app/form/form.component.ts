import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/apiService';
import { SweetAlertService } from 'src/services/sweetAlertService';
import { Field } from '../models/field';
import {Container} from '../models/ContainerField';
import { formBody } from '../models/formBody';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {

  @ViewChild('myPond') myPond: any;

  fields:Field[];

  myForm:UntypedFormGroup; 
  files:any[];
  serviceId:string|undefined;
  BluePrintId:string|undefined;
  isLoading=true;
  pondFiles: string[] = [];
  service:any;
  nationalId:string="9971063036";
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

      this.files.push({controlName:controlName,fileBase64:base64WithoutPrefix});

      console.log(this.files);
    };

  }

  GetContainerItems(containerId:string):Container[]{
    var filterdContainer=this.containers.filter(x=>x.containerId==containerId);
    return filterdContainer;
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

  Save(){

    this.submitted=true;

    var formValues:formBody[]=[];

    if(this.myForm.valid){

      this.submitted=false;
      this.isLoading=true;

      const controls = this.myForm.controls;
      
      Object.keys(controls).map((key) => {

        var controlValue=null;
        var controlType="STRING";

        if (!/#\d+$/.test(key)) {
              
          var filed=this.fields.filter(x=>x.id==key)[0];

          if(filed.type=="TEXT_FIELD"){

            controlValue = String(controls[key].value);
          } 
          else if(filed.type=="FILE"){

            controlType="FILE";

            var file=this.files.filter(x=>x.controlName==filed.id)[0];

            if(file!=null){
              var files=  [file.fileBase64??null];
              controlValue=files;
            }
            else{
              controlValue=null;
            }
          }
          else if(filed.type=="CHECKBOX"){

            controlType="BOOLEAN";

            controlValue=this.checkCbValue(key);
            
          }
          else if(filed.type=="CONTAINER"){

            controlType="CONTAINER";

            var containerItems=this.containers.filter(x=>x.containerId==filed.id );

            var containerValue:any[]=[];
            var fields:any[]=[];
            
            containerItems.map(containerItem=>{

              fields=[];

              var index=containerItem.index;

              containerItem.containerFields.map(field=>{
                
                var formField=this.myForm.get(`${field.id}#${index}`);

                var fieldValue=formField?.value;

                if(field.type=="CHECKBOX"){

                  fieldValue=this.checkCbValue(key);

                }

                fields.push(new formBody(controlType,field.id,fieldValue));

              });

              containerValue.push([...fields]);

            });

            controlValue= JSON.stringify(containerValue);

          }
          else{
            controlValue=controls[key].value;

          }

          formValues.push(new formBody(controlType,key,controlValue ?? ""));

        }
      });


      var body={
        "userId": this.nationalId,
        "serviceId": `${this.serviceId}`,
        "values": formValues,
      };

      var request=this.apiService.post('carboncopies/PostDataForConsumer',body);

      request.subscribe(response=>{

        var data=response.data;

        if(response.statusCode==200){

          this.isLoading=false;
          
          if(data.continue==false){
            this.sweetAlertService.ShowAlertThenRedirect('success',response.message,'/');
          }else{

            this.removeFormControls();

            this.GetStepForConsumer();
          }
        }

        console.log(response);
      });

    }
    else{
      console.log(this.myForm);
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
