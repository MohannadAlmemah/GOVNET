import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ApiService } from 'src/services/apiService';
import { SweetAlertService } from 'src/services/sweetAlertService';

@Component({
  selector: 'app-investment-forget-password',
  templateUrl: './investment-forget-password.component.html',
  styleUrls: ['./investment-forget-password.component.css']
})
export class InvestmentForgetPasswordComponent {


  constructor(private apiService:ApiService,private sweetAlertService:SweetAlertService) {
   
  }

  @ViewChild('myForm', { static: true }) myForm: NgForm | undefined;
  @ViewChild('sendOtpForm', { static: true }) sendOtpForm: NgForm | undefined;
  @ViewChild('changePasswordForm', { static: true }) changePasswordForm: NgForm | undefined;

  username:string|undefined;
  emailFirstChar:string|undefined;
  phoneFirstChar:string|undefined;
  visible:boolean=false;
  checkType:number=1;
  checkStr:string|undefined;

  showChangePasswordForm:boolean=false;

  newPass:string|undefined;
  reNewPass:string|undefined;
  otp:string|undefined;
  forgotToken:string|undefined;
  selectedType:string|undefined;


  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  phoneNumber:any|undefined;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Jordan];
  

  checkUsername(){
    if(this.myForm?.valid){

      var body={
        "userName": this.username,
      }

      var request=this.apiService.post('auth/ForgotPasswordCheckUserName',body);

      request.subscribe(response=>{

        if(response.statusCode===200){

          var data=response.data;

          this.visible=true;
          this.emailFirstChar=data.email;
          this.phoneFirstChar=data.phoneNumber;

          
        }else if(response.statusCode===400){

          this.sweetAlertService.ShowAlert('error',response.message);

        }else{
          this.sweetAlertService.ShowAlert('info',response.message);
        }

      });

    }
  }


  sendOtp(){

    if(this.sendOtpForm?.valid){


      this.selectedType= this.checkType == 1? 'email': 'phoneNumber';

      var body={
        "userName": this.username,
        "type": this.selectedType,
        "input": this.checkType == 1 ? this.checkStr:this.phoneNumber.e164Number,
      };
  
      var request=this.apiService.post('auth/ForgotPasswordSendOtp',body);
  
      request.subscribe(response=>{
        
        if(response.statusCode===200){

          this.visible=false;

          this.forgotToken=response?.data?.forgotToken;

          this.showChangePasswordForm=true;

        }else if(response.statusCode===400){

          this.sweetAlertService.ShowAlert('error',response.message);

        }else{
          this.sweetAlertService.ShowAlert('info',response.message);
        }

      });

    }else{
      console.log(this.sendOtpForm);
    }

  }


  changePassword(){

    if(this.changePasswordForm?.valid==true){

      var body={
        "userName": this.username,
        "newPassword": this.newPass,
        "otp": this.otp,
        "forgotToken": this.forgotToken,
        "type": this.selectedType
      };

      var request=this.apiService.post('auth/ForgotPassword',body);

      request.subscribe(response=>{

        if(response.statusCode==200){

          this.sweetAlertService.ShowAlertThenRedirect('success',response.message,'Investment/login');

        }else if(response.statusCode===400){

          this.sweetAlertService.ShowAlert('error',response.message);

        }else{
          this.sweetAlertService.ShowAlert('info',response.message);
        }

      });

    }

  }


}
