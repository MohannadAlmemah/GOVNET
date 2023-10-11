import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/services/apiService';
import { AuthService } from 'src/services/auth.service';
import { SweetAlertService } from 'src/services/sweetAlertService';
import jwt_decode from "jwt-decode";


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
      
  }

  login(){

    if(this.myForm?.valid){

      this.isLoading=true;

        var body={
          "userName": this.username,
          "password": this.password,
          "deviceToken": ""
        }
      
        var request=this.apiService.post('Auth/Login',body);
    
        request.subscribe(res=>{

          this.isLoading=false;

          if(res.statusCode==200){

            var token = res.data.access_token;
            var decoded = jwt_decode(token) as any;
            
            var roel= decoded.role as string;
          
            this.authService.setToken(res.data.access_token);
            this.authService.setRole(roel);
            this.authService.setRefreshToken(res.data.refresh_token);
            this.authService.setNationalNumber(this.username!);

            if(roel.toLowerCase()=="admin"){
              location.href='/Investment/Admin/Users';
            }else{
              location.href='/Investment/Dashboard';
            }

          }else{
            this.sweetAlertService.ShowAlert('error',res.message);
          }
        });

    }


  }


}
