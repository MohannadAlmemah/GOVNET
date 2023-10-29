
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/apiService';
import { SweetAlertService } from 'src/services/sweetAlertService';
import jwt_decode from "jwt-decode";

export class jamarekObj{
  public id :number;
  public unitName :string ;
  public unitId :string ;
  public quantity :string ;
  public staticUnit :string ;
  public isTaxExempt :boolean =false ;

  /**
   *
   */
  constructor(id :number,unitName :string,unitId :string,quantity :string,staticUnit :string,isTaxExempt :boolean) {
    this.id=id;
    this.unitName=unitName;
    this.unitName=unitName;
    this.unitId=unitId;
    this.isTaxExempt=isTaxExempt;
    this.quantity=quantity;
    this.staticUnit=staticUnit;
    
  }
}

@Component({
  selector: 'app-jamarek',
  templateUrl: './jamarek.component.html',
  styleUrls: ['./jamarek.component.css']
})
export class JamarekComponent {

  form!: FormGroup;
  statisticalUnits:any[]=[];
  units:any[][] = [];
  carbonCopyId:string|undefined;
  hideisTaxExempt=false;
  formSubmited:boolean=false;
  isLoading=true;
  userType="Employee";
  countries: any[]=[];

  selectedCountry: any | undefined;

  constructor(private fb: FormBuilder,private apiService:ApiService,private route: ActivatedRoute,private alertService:SweetAlertService) {

    this.fillStaticUnit();

    if(this.route.snapshot.queryParams['Token'] && this.route.snapshot.queryParams['CarbonCopyId']){

      this.carbonCopyId= this.route.snapshot.queryParamMap.get('CarbonCopyId')!;

      this.form = this.fb.group({
        taxNumber:['', Validators.required],
        formItems: this.fb.array([])
      });

      this.fillApplicant(this.carbonCopyId);

      // var token = this.route.snapshot.queryParamMap.get('Token')!;

      // var decoded = jwt_decode(token) as any;
      
      // var roel= decoded.role as string;

      // if(roel.toLocaleLowerCase() =='consumer'){
      //   this.hideisTaxExempt=true;
      // }else{
      //   this.hideisTaxExempt=false;
      // }

    }


  }


  generateItem(data?: {
    id?: number;
    unitName?: string;
    unitId?: string;
    quantity?: string;
    staticUnit?: string;
    isTaxExempt?: boolean;
  }): FormGroup {

    return this.fb.group({
      id: [data?.id ||0],
      unitName: [data?.unitName || '', Validators.required],
      unitId: [data?.unitId || '', [Validators.required]],
      quantity: [data?.quantity || '', Validators.required],
      staticUnit: [data?.staticUnit || '', Validators.required],
      isTaxExempt: [data?.isTaxExempt || false],
    });
    
  }

  get Items() {
    return this.form.get('formItems') as FormArray;
  }

  addItem() {
    this.Items.push(this.generateItem());
  }

  addItemWithValue(data:FormGroup) {
    this.Items.push(data);
  }

  removeName(index: number) {
    this.Items.removeAt(index);
  }

  
  onSubmit() {

    this.formSubmited=true;

    if(this.form.valid){

      this.formSubmited=false;

      var headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Accept-Language': 'ar-JO',
        'Password': 'LASU2zapNIrqJAVX',
      });

      var gamarekExemptionReqest:any[]=[];

      let items = this.Items;

      items.controls.forEach((control, index) => {

        var data={
          "id": control.get('id')?.value,
          "ssCode": control.get('unitId')?.value,
          "additionalCode":  "Default",
          "quantity": control.get('quantity')?.value,
          "statisticalUnit": control.get('staticUnit')?.value,
          "isTaxExempt":control.get('isTaxExempt')?.value ,
          "searchKeyword": control.get('unitName')?.value
        };

        gamarekExemptionReqest.push(data);
      });

      var body={
        "carponcopyid": this.carbonCopyId,
        "taxNumber": this.form.get('taxNumber')?.value,
        "gamarekExemptionReqest": gamarekExemptionReqest,
      }

      if(this.userType=="Employee"){
        var request=this.apiService.post('Customs/UpdateSubmitForm',body,'https://appv4.sanad.gov.jo/api',headers);

        request.subscribe(response=>{
          if(response){
            if(response.value==true){
              this.alertService.ShowAlertThenRedirect('success','تم الحفظ بنجاح','/Investment/Dashboard');
            }
          }
        });
      }else{
        var request=this.apiService.post('Customs/SubmitForm',body,'https://appv4.sanad.gov.jo/api',headers);

        request.subscribe(response=>{
          if(response){
            if(response.value==true){
              this.alertService.ShowAlertThenRedirect('success','تم الحفظ بنجاح','/Investment/Dashboard');
            }
          }
        });
      }



    }
  }

  


  fillStaticUnit(){
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': 'ar-JO',
      'Password': 'LASU2zapNIrqJAVX',
    });

    var request= this.apiService.get('Customs/GetStatisticalUnits' , 'https://appv4.sanad.gov.jo/api', headers);

    request.subscribe(response=>{
      var list=response.list;
      this.statisticalUnits=list;
    });

  }

  fillApplicant(carbonId:string){

    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': 'ar-JO',
      'Password': 'LASU2zapNIrqJAVX',
    });

    var request=this.apiService.get('Customs/GetAllCustomsExemptionDatalicenseId?licenseId='+carbonId,'https://appv4.sanad.gov.jo/api',headers);

    request.subscribe(response=>{
      var data=response as any[];
      if(data.length>0){

        this.form.get('taxNumber')?.setValue(data[0].taxNumber);

        data.map((item,index)=>{

          var obj=new jamarekObj(item.id,item.searchKeyword,item.hsCode,'1',item.statisticalUnit,item.isTaxExempt);
          var form= this.generateItem(obj);
          this.searchEnquiry(item.searchKeyword,index);
          this.addItemWithValue(form);

          this.isLoading=false;

        })
      }else{

        this.addItem();

        this.isLoading=false;

      }
    });

  }

  async getUnits(event:Event, index: number){
    
    const inputElement = event.target as HTMLInputElement; // Type assertion
    const text = inputElement.value;


    await this.searchEnquiry(text, index);

  }


  private searchEnquiry(text: string, index: number) {

    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': 'ar-JO',
      'Password': 'LASU2zapNIrqJAVX',
    });

    var request = this.apiService.get('Customs/GeneralEnquiry?description=' + text, 'https://appv4.sanad.gov.jo/api', headers);

    request.subscribe(response => {
      this.units[index] = response.list as any[];
    });
  }
}

