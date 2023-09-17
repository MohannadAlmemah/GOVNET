import { Component } from '@angular/core';
import { ApiService } from 'src/services/apiService';

@Component({
  selector: 'app-investment-profile',
  templateUrl: './investment-profile.component.html',
  styleUrls: ['./investment-profile.component.css']
})
export class InvestmentProfileComponent {


  userInfo:any;
  isLoading:boolean=true;

  constructor(private apiService:ApiService) {

      this.getUserInfo();

  }

  getUserInfo(){
    var request= this.apiService.get('Consumer/GetInfo');

    request.subscribe(response=>{

      if(response.statusCode==200){
        this.userInfo=response.data;
      }

      this.isLoading=false;

    });

  }


}
