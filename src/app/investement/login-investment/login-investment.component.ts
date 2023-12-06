import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/services/apiService';
import { AuthService } from 'src/services/auth.service';
import { SweetAlertService } from 'src/services/sweetAlertService';
import jwt_decode from "jwt-decode";
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';


@Component({
  selector: 'app-login-investment',
  templateUrl: './login-investment.component.html',
  styleUrls: ['./login-investment.component.css']
})
export class LoginInvestmentComponent {

  @ViewChild('myForm', { static: true }) myForm: NgForm | undefined;

  username:string|undefined;
  password:string|undefined;
  isLoading=false;

  constructor(private apiService:ApiService,
    private sweetAlertService:SweetAlertService,
    private authService: AuthService
    ) {

      if(localStorage.getItem('showAlert')==null){
        sweetAlertService.ShowAlert('info',`الرجاء التسجيل على تطبيق سند أو استخدام حسابك الفعلي عليه والذي سيمكنك من الدخول الى منصة خدمات وزارة الاستثمار الالكترونية
        من خلال  <a href='https://play.google.com/store/apps/details?id=com.modee.sanad' target='_blank'>  جوجل بلاي  </a> او <a href='https://apps.apple.com/jo/app/sanadjo-%D8%B3%D9%86%D8%AF/id1487779718' target='_blank'>  آب ستور  </a>
        `);
      }

      localStorage.setItem('showAlert','show');

  }

  registerSabad(){
    this.sweetAlertService.ShowAlert('info',"يرجى انشاء حساب على تطبيق سند");
  }

  login(){

    if(this.myForm?.valid){

      this.isLoading=true;

      //var request = this.apiService.login(this.username!,this.password!);

      var body={
        "userName": this.username!,
        "password": this.password!,
        "deviceToken": "",
      }

      this.apiService.post("auth/IdmToken",body).subscribe(response => {
        
          if(response.statusCode==200){

            this.isLoading=false;
            
            var data=response.data;

            setTimeout(() => {
              this.authService.setToken(data.id_token);
              this.authService.setRefreshToken(data.refresh_token);
              this.authService.setNationalNumber(this.username!);

              location.href='/Investment/Dashboard';
            }, 1000);

          }else{
            this.isLoading=false;

            var message="حدث خطأ";

            var errorData=response.data;

            if(errorData.error=="mapping_error"){
              message="اسم المتسخدم / كلمة المرور غير صحيحة";
            }


            this.sweetAlertService.ShowAlert('error',message);
          }
        },
        error => {
          this.isLoading=false;

          console.error('Error:', error);
        }
      );

        // var body={
        //   "userName": this.username,
        //   "password": this.password,
        //   "deviceToken": ""
        // }
      
        // var request=this.apiService.post('Auth/Login',body);
    
        // request.subscribe(res=>{

        //   this.isLoading=false;

        //   if(res.statusCode==200){

        //     var token = res.data.access_token;
        //     var decoded = jwt_decode(token) as any;
            
        //     var roel= decoded.role as string;
          
        //     this.authService.setToken(res.data.access_token);
        //     this.authService.setRole(roel);
        //     this.authService.setRefreshToken(res.data.refresh_token);
        //     this.authService.setNationalNumber(this.username!);

        //     if(roel.toLowerCase()=="admin"){
        //       location.href='/Investment/Admin/Users';
        //     }else{
        //       location.href='/Investment/Dashboard';
        //     }

        

    }


  }


}
