import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/apiService';
import { SweetAlertService } from 'src/services/sweetAlertService';
import { jamarekObj } from '../jamarek/jamarek.component';
import jwt_decode from "jwt-decode";
import { environment } from 'src/environments/environment.development';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-edti-jamarek',
  templateUrl: './edti-jamarek.component.html',
  styleUrls: ['./edti-jamarek.component.css']
})

export class EdtiJamarekComponent {

  form!: FormGroup;
  statisticalUnits:any[]=[];
  units:any[][] = [];
  taxUnits:any[][] = [];
  carbonCopyId:string|undefined;
  hideisTaxExempt=false;
  formSubmited:boolean=false;
  isLoading=true;

  showSaveBtn=true;  

  public exemptAssetsList:any[]=[];

  

  getExemptAssetsList(){

    
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': 'ar-JO',
      'Password': 'LASU2zapNIrqJAVX',
    });

    var request=this.apiService.get("Investment/GetFindings",`${environment.getterLink}`,headers);

    request.subscribe(response=>{
      var data=response.list as any[];

      var newList= data.map(item=>{

        var value=  item.value as string;

        var newValue=value.substring(0,50);

        return  {
          key:item.key,
          value:newValue,
        }

      });

      this.exemptAssetsList=newList;

    });
  }

  constructor(private fb: FormBuilder,private apiService:ApiService,private authService:AuthService,
    private route: ActivatedRoute,private alertService:SweetAlertService) {

    this.getExemptAssetsList();
    this.fillStaticUnit();

    if(this.route.snapshot.queryParams['Token'] && this.route.snapshot.queryParams['Carponcopyid']){

      this.carbonCopyId= this.route.snapshot.queryParamMap.get('Carponcopyid')!;

      var TaxNumber = this.route.snapshot.queryParamMap.get('TaxNumber')!;

      this.form = this.fb.group({
        taxNumber:[TaxNumber, Validators.required],
        formItems: this.fb.array([]),
        taxItems: this.fb.array([]),
      });

      this.fillApplicant(this.carbonCopyId);
      this.fillTaxApplicant(this.carbonCopyId);

      var token = this.route.snapshot.queryParamMap.get('Token')!;

      var decoded = jwt_decode(token) as any;
      
      var role= decoded.role as string|string[];

      if (Array.isArray(role)) {
        this.hideisTaxExempt=false;
      }else{
        //location.href="/Investment/Dashboard";
        this.hideisTaxExempt=true;
      }
      
    }else{
      location.href="/Investment/Dashboard";
    }
  }


  generateItem(data?: {
    id?: number;
    unitName?: string;
    unitId?: string;
    quantity?: string;
    exemptAssets?: string;
    staticUnit?: string;
    isTaxExempt?: boolean;
    hsCode?: boolean;
  }): FormGroup {

    return this.fb.group({
      id: [data?.id ||0],
      unitName: [data?.unitName || '', Validators.required],
      unitId: [data?.unitId || '', [Validators.required]],
      quantity: [data?.quantity || '', Validators.required],
      exemptAssets: [ data?.exemptAssets  || '', Validators.required],
      staticUnit: [data?.staticUnit || '', Validators.required],
      isTaxExempt: [data?.isTaxExempt || false],
      hsCode: [data?.unitId || ''],
    });
    
  }

  get Items() {
    return this.form.get('formItems') as FormArray;
  }

  get TaxItems() {
    return this.form.get('taxItems') as FormArray;
  }

  addItem() {
    this.Items.push(this.generateItem());
  }

  addItemWithValue(data:FormGroup) {
    this.Items.push(data);
  }


  removeJamarek(index: number) {
    this.Items.removeAt(index);
  }

  removeTax(index: number) {
    this.TaxItems.removeAt(index);
  }

  addTaxItem() {
    this.TaxItems.push(this.generateItem());
  }

  addTaxItemWithValue(data:FormGroup) {
    this.TaxItems.push(data);
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

      var taxExemptionReqest:any[]=[];

      let items = this.Items;
      let taxItems = this.TaxItems;

      items.controls.forEach((control, index) => {

        var data={
          "id": control.get('id')?.value,
          "ssCode": control.get('unitId')?.value,
          "additionalCode":  "Default",
          "quantity": control.get('quantity')?.value,
          "statisticalUnit": control.get('staticUnit')?.value,
          "exemptAssets": control.get('exemptAssets')?.value,
          "isTaxExempt":control.get('isTaxExempt')?.value ,
          "searchKeyword": control.get('unitName')?.value
        };

        gamarekExemptionReqest.push(data);
      });

      taxItems.controls.forEach((control, index) => {

        var data={
          "id": control.get('id')?.value,
          "ssCode": control.get('unitId')?.value,
          "additionalCode":  "Default",
          "quantity": control.get('quantity')?.value,
          "statisticalUnit": control.get('staticUnit')?.value,
          "exemptAssets": control.get('exemptAssets')?.value,
          "isTaxExempt":control.get('isTaxExempt')?.value ,
          "searchKeyword": control.get('unitName')?.value
        };

        taxExemptionReqest.push(data);
      });

      var body={
        "carponcopyid": this.carbonCopyId,
        "taxNumber": this.form.get('taxNumber')?.value,
        "userId":this.authService.getNationalNumber(),
        "jamarekItems": gamarekExemptionReqest,
        "taxItems":taxExemptionReqest,
      }

      var request=this.apiService.post('Customs/UpdateSubmitExemptionForm',body,`${environment.getterLink}`,headers);

        request.subscribe(response=>{
          if(response){
            if(response.value==true){
              
              this.showSaveBtn=false;

              this.alertService.ShowAlert('success',' تم الحفظ بنجاح');
            }
          }
        });



    }
  }

  


  fillStaticUnit(){
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': 'ar-JO',
      'Password': 'LASU2zapNIrqJAVX',
    });

    var request= this.apiService.get('Customs/GetStatisticalUnits' , `${environment.getterLink}`, headers);

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

    var request=this.apiService.get('Customs/GetAllCustomsExemptionDatalicenseId?licenseId='+carbonId,`${environment.getterLink}`,headers);

    request.subscribe(response=>{
      var data=response as any[];
      if(data.length>0){

        this.form.get('taxNumber')?.setValue(data[0].taxNumber);

        data.map((item,index)=>{

          var obj=new jamarekObj(item.id,item.searchKeyword,item.hsCode,item.remainingQuantity,item.statisticalUnit,item.isTaxExempt,item.exemptAssets);
          var form= this.generateItem(obj);
          this.searchEnquiry(item.searchKeyword,index);
          this.addItemWithValue(form);

          this.isLoading=false;

        })
      }else{

        //this.addItem();

        this.isLoading=false;

      }
    });

  }

  fillTaxApplicant(carbonId:string){

    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': 'ar-JO',
      'Password': 'LASU2zapNIrqJAVX',
    });

    var request=this.apiService.get('Customs/GetAllTaxCustomsExemptionDatalicenseId?licenseId='+carbonId,`${environment.getterLink}`,headers);

    request.subscribe(response=>{
      var data=response as any[];
      if(data.length>0){

        data.map((item,index)=>{

          var obj=new jamarekObj(item.id,item.searchKeyword,item.hsCode,item.remainingQuantity,item.statisticalUnit,item.isTaxExempt,item.exemptAssets);
          var form= this.generateItem(obj);
          this.searchTaxEnquiry(item.searchKeyword,index);
          this.addTaxItemWithValue(form);

          this.isLoading=false;

        })
      }else{

        //this.addTaxItem();

        this.isLoading=false;

      }
    });

  }

  async getUnits(event:Event, index: number){
    
    const inputElement = event.target as HTMLInputElement; // Type assertion
    const text = inputElement.value;


    await this.searchEnquiry(text, index);

  }

  async getTaxUnits(event:Event, index: number){
    
    const inputElement = event.target as HTMLInputElement; // Type assertion
    const text = inputElement.value;


    await this.searchTaxEnquiry(text, index);

  }


  private searchEnquiry(text: string, index: number) {

    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': 'ar-JO',
      'Password': 'LASU2zapNIrqJAVX',
    });

    var request = this.apiService.get('Customs/GeneralEnquiry?description=' + text, `${environment.getterLink}`, headers);

    request.subscribe(response => {
      this.units[index] = response.list as any[];
    });
  }

  private searchTaxEnquiry(text: string, index: number) {

    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': 'ar-JO',
      'Password': 'LASU2zapNIrqJAVX',
    });

    var request = this.apiService.get('Customs/GeneralEnquiry?description=' + text, `${environment.getterLink}`, headers);

    request.subscribe(response => {
      this.taxUnits[index] = response.list as any[];
    });
  }

  onUnitIdChange(event: any, index: number) {
    const selectedUnitId = event.target.value;


  
    const selectedUnit = this.units[index].find(unit => unit.key === selectedUnitId);

    if (selectedUnit) {
      const itemsArray = this.form.get('formItems') as FormArray;
      const itemGroup = itemsArray.at(index) as FormGroup;

      itemGroup.get('hsCode')?.setValue(selectedUnit.key);


    }
  }

  onTaxUnitIdChange(event: any, index: number) {
    const selectedUnitId = event.target.value;
  
    const selectedUnit = this.taxUnits[index].find(unit => unit.key === selectedUnitId);

    if (selectedUnit) {
      const itemsArray = this.form.get('taxItems') as FormArray;
      const itemGroup = itemsArray.at(index) as FormGroup;

      itemGroup.get('hsCode')?.setValue(selectedUnit.key);


    }
  }

  
}
