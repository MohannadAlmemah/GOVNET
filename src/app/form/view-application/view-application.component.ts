import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/apiService';
import { AuthService } from 'src/services/auth.service';
import { SweetAlertService } from 'src/services/sweetAlertService';
import { Field } from '../../models/field';
import { FormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.css']
})
export class ViewApplicationComponent {

  isLoading=true;
  myForm:UntypedFormGroup; 
  serviceId:string|undefined;
  serviceName:string|undefined;

  stepsName:string[]=[];

  currentStep="1";

  currentStepFields:Field[]=[];

  


  constructor(private apiService:ApiService,private route: ActivatedRoute, private el: ElementRef,
    private sweetAlertService:SweetAlertService,private authService:AuthService
    ) {

      this.myForm=new UntypedFormGroup({});
      
      if(this.route.snapshot.queryParams['serviceId']){
        this.serviceId=this.route.snapshot.queryParams['serviceId'];
      }else{
        location.href="/Investment/Dashboard";
      }

      this.fillApplication();
  
  }

  fillApplication(){

    var request=this.apiService.get(`carboncopies/GetServiceByIdForConsumer?serviceId=${this.serviceId}&type=CURRENT`);

    request.subscribe(response=>{

      var data=response.data;

      this.serviceName=data.name;

      var steps=data.steps as any[];

      this.currentStepFields=steps[0]?.fields;

      steps.map(step=>{
        this.stepsName.push(step.name);
      });

      var fields=steps[0].fields as any[];

      fields.map(field=>{
        this.myForm.addControl(field.id,new FormControl(field.value));
      });



      this.isLoading=false;

      console.log(this.myForm);

    });

  }



}
