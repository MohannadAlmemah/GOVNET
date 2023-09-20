import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ApiService } from 'src/services/apiService';
import { SweetAlertService } from 'src/services/sweetAlertService';
// import intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-investement-signup',
  templateUrl: './investement-signup.component.html',
  styleUrls: ['./investement-signup.component.css']
})
export class InvestementSignupComponent {

  @ViewChild('myForm', { static: true }) myForm: NgForm | undefined;


  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  phoneNumber:any|undefined;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Jordan];
 
  
  
  constructor(private apiService:ApiService,private sweetAlert:SweetAlertService,
    private renderer: Renderer2) {

     // this.initIntlTelInput();
  }

  // initIntlTelInput() {
  //   const inputElement = this.phoneInput.nativeElement;
  //   const intlTelInputOptions = {
  //     // intl-tel-input options here
  //   };

  //   // Initialize intlTelInput
  //   const intlTelInput = window.intlTelInput(inputElement, intlTelInputOptions);
  // }

  daysArr: string[] = Array.from({ length: 31 }, (_, index) => (index + 1).toString().padStart(2, '0'));

  monthArr: string[] = Array.from({ length: 12 }, (_, index) => (index + 1).toString().padStart(2, '0'));

  yearsArr: number[] = Array.from({ length: 2023 - 1930 + 1 }, (_, i) => 1930 + i);


  userName:string|undefined;
  idNumber:string|undefined;
  email:string|undefined;
  emailOtp:string|undefined;
  phoneNumberOtp:string|undefined;
  password:string|undefined;
  nationality:string="";
  day:string="";
  month:string="";
  year:string="";

  showEmailRequeired:boolean=false;
  showPhoneRequeired:boolean=false;

  disableSendEmailBtn:boolean=false;
  disableSendPhoneBtn:boolean=false;



  register(){

    console.log(this.myForm);

    if(this.myForm?.valid){

      var body={
        "userName": String(this.userName),
        "password": this.password,
        "phoneNumber": this.phoneNumber.e164Number,
        "phoneNumberOTP": this.phoneNumberOtp,
        "email": this.email,
        "emailOTP": this.emailOtp,
        "deviceToken": "",
        "question": {
          "type": this.nationality=='1'?"IdNo":"BirthDate",
          "answer": this.nationality=='1'? this.idNumber : (this.day+"/"+this.month+"/"+this.year),
        }
      };

      

      var request=this.apiService.post('auth/Register',body);

      request.subscribe(response=>{

        if(response.statusCode==200){

          this.sweetAlert.ShowAlertThenRedirect('success',response.message,'Investment/login');

        }else{
          this.sweetAlert.ShowAlert('error',response.message);
        }

      });

    }
  }

  sendEmailOtp(){
    if(this.email!='' && this.email!=undefined && this.email!=null){

      this.showEmailRequeired=false;

      this.disableSendEmailBtn=true;

      setTimeout(() => {
        this.disableSendEmailBtn=false;
      }, 30000);

      var body={
        "email": this.email
      }

      var request=this.apiService.post("auth/SendOtpToEmail",body);

      request.subscribe(response=>{

        if(response.statusCode==200){
          this.sweetAlert.ShowAlert('success','تم الارسال بنجاح');
        }else{
          this.sweetAlert.ShowAlert('error','حدث خطأ يرجى المحاولة مره اخرى');
        }

      });

    }else{
      this.showEmailRequeired=true;

    }
  }

  sendPhoneOtp(){
    if(this.phoneNumber!='' && this.phoneNumber!=undefined && this.phoneNumber!=null){

      this.showPhoneRequeired=false;

      this.disableSendPhoneBtn=true;

      setTimeout(() => {
        this.disableSendPhoneBtn=false;
      }, 30000);


      var body={
        "phoneNumber": this.phoneNumber.e164Number
      }

      var request=this.apiService.post("auth/SendOtpToPhoneNumber",body);

      request.subscribe(response=>{

        if(response.statusCode==200){
          this.sweetAlert.ShowAlert('success','تم الارسال بنجاح');
        }else{
          this.sweetAlert.ShowAlert('error','حدث خطأ يرجى المحاولة مره اخرى');
        }

      });

    }else{
      this.showPhoneRequeired=true;
    }
  }


}
