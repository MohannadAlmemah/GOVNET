import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/services/apiService';

@Component({
  selector: 'app-jamarek',
  templateUrl: './jamarek.component.html',
  styleUrls: ['./jamarek.component.css']
})
export class JamarekComponent {

  form: FormGroup;
  statisticalUnits:any[]=[];
  units:any[][] = [];
  
  constructor(private fb: FormBuilder,private apiService:ApiService) {

    this.fillStaticUnit();
    
    this.form = this.fb.group({
      taxNumber:['', Validators.required],
      fromItems: this.fb.array([this.createItem()])
    });

  }

  createItem(): FormGroup {
    return this.fb.group({
      unitName: ['', Validators.required],
      unitId: ['', [Validators.required]],
      quantity: ['', Validators.required],
      staticUnit:['', Validators.required],
    });
  }

  get Items() {
    return this.form.get('fromItems') as FormArray;
  }

  addItem() {
    this.Items.push(this.createItem());
  }

  removeName(index: number) {
    this.Items.removeAt(index);
  }

  onSubmit() {
    console.log(this.form.value);
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

  getUnits(event:Event, index: number){

    const inputElement = event.target as HTMLInputElement; // Type assertion
    const text = inputElement.value;

    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': 'ar-JO',
      'Password': 'LASU2zapNIrqJAVX',
    });

    var request=this.apiService.get('Customs/GeneralEnquiry?description='+text,'https://appv4.sanad.gov.jo/api',headers);

    request.subscribe(response=>{
      this.units[index] = response.list as any[];
    });

  }

}
