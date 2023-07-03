import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ApiService } from 'src/services/apiService';
// import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  fileds:any[]
  myForm:UntypedFormGroup;
  files:any[]

  constructor(private apiService:ApiService) {
    this.fileds=[];
    this.myForm=new UntypedFormGroup({});
    this.files=[];
  }

  onUploadFile(controlName:string,event:any){

    const reader = new FileReader();
    var file=event.target.files[0];
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64String = reader.result as string;

      const base64WithoutPrefix = base64String?.substring(base64String.indexOf(',') + 1);

      this.files.push({controlName:controlName,fileBase64:base64WithoutPrefix});

    };

  }

  ngOnInit(): void {

    this.fileds=[
      {
          "type": "FILE",
          "required": true,
          "multiSelect": false,
          "mediaType": "IMAGE",
          "values": null,
          "allowedExtensions": [],
          "id": "@id/step_3/image",
          "label": "Image",
          "hidden": false,
          "value": null,
          "comment": null
      },
      {
          "type": "COMBO_BOX",
          "multiSelect": false,
          "comboBoxOptions": [
              {
                  "key": "1",
                  "value": "استلام شخصي"
              },
              {
                  "key": "2",
                  "value": "البريد الاردني"
              },
              {
                  "key": "3",
                  "value": "ارامكس"
              }
          ],
          "id": "@id/step_3/delivery_method",
          "label": "Delivery Method",
          "hidden": false,
          "value": null,
          "comment": null
      },
      {
          "type": "COMBO_BOX",
          "multiSelect": false,
          "comboBoxOptions": [
              {
                  "key": "1",
                  "value": "تحويل بنكي"
              },
              {
                  "key": "2",
                  "value": "اي فواتيركم"
              }
          ],
          "id": "@id/step_3/payment_method",
          "label": "Payment Method",
          "hidden": false,
          "value": null,
          "comment": null
      },
  ];

  this.fileds.map(filed=>{
    this.myForm.addControl(filed.id,new FormControl(""));
  })

    var request=this.apiService.get('carboncopies/GetStepForConsumer?userId=9862015192&serviceId=6448e783255a7108b141afdb')
    var response=request.subscribe(res=>{
      var data=res.data[0];
      
    })
  }

  Save(){
    if(true){

      const controls = this.myForm.controls;
      
      var values=Object.keys(controls).map((key) => {

        var filed=this.fileds.filter(x=>x.id==key)[0];

        var controlValue=null;

        if(filed.type=="FILE"){

          var file=this.files.filter(x=>x.controlName==filed.id)[0];

          controlValue=file.fileBase64;
        }else{

          controlValue=controls[key].value;

        }

        return {
          fieldId:key,
          value:controlValue??"",
        }
      });


      var body={
        "stepSentByConsumer": {
          "userId": "9862015192",
          "serviceId": "6448e783255a7108b141afdb",
          "values": values,
        }
      };

      console.log(JSON.stringify(body));

      var request=this.apiService.post('carboncopies/PostDataForConsumer',body);

      request.subscribe(res=>{
        console.log(res);
      })

    }
  }

  
}
