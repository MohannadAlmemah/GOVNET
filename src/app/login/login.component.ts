import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/apiService';
import { AuthService } from 'src/services/auth.service';
import { SweetAlertService } from 'src/services/sweetAlertService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string|undefined;
  password: string|undefined;

  constructor(private apiService:ApiService,private route: ActivatedRoute,
    private sweetAlertService:SweetAlertService,private authService: AuthService
    ) {
      
    }

  login() {

    var body={
      grant_type:'password',
      client_secret:'k22DtPUNkpFbO3JqCDwn',
      client_id:'HrFZUo8o6dg4gUDzkYAi',
      username:this.username,
      password:this.password,
      scope:'openid',
    };
    

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Cookie', 'AMWEBJCT!%2Fmga!JSESSIONID=0000X7oeclZYSTcv9IEEaQs722S:83750161-035c-49f6-90d6-7d3b4956054d; PD_STATEFUL_fbaa33fa-3df7-11ea-9b29-005056a841aa=%2Fmga');


    var request=this.apiService.login('https://portal.jordan.gov.jo/mga/sps/oauth/oauth20/token',body,headers);

    request.subscribe(res=>{
      console.log(res);
    });

  }
}
