import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/services/apiService';
import { AuthService } from 'src/services/auth.service';
import { SweetAlertService } from 'src/services/sweetAlertService';

@Component({
  selector: 'app-login-investment',
  templateUrl: './login-investment.component.html',
  styleUrls: ['./login-investment.component.css']
})
export class LoginInvestmentComponent {

  @ViewChild('myForm', { static: true }) myForm: NgForm | undefined;

  username:string|undefined;
  password:string|undefined;


  constructor(private apiService:ApiService,
    private sweetAlertService:SweetAlertService,
    private authService: AuthService
    ) {
      
  }

  login(){

    if(this.myForm?.valid){

        var body={
          "userName": this.username,
          "password": this.password,
          "deviceToken": ""
        }
      
        var request=this.apiService.post('Auth/Login',body);
    
        request.subscribe(res=>{

          if(res.statusCode==200){

            location.href='/Investment/Dashboard';
           
            this.authService.setToken(res.data.access_token);
            this.authService.setRefreshToken(res.data.refresh_token);
            this.authService.setNationalNumber(this.username!);

          }else{
            this.sweetAlertService.ShowAlert('error',res.message);
          }
        });

    }


  }


}
