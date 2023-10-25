import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { finalize, forkJoin, tap } from 'rxjs';
import { ApiService } from 'src/services/apiService';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-investment-profile',
  templateUrl: './investment-profile.component.html',
  styleUrls: ['./investment-profile.component.css']
})
export class InvestmentProfileComponent {


  userInfo:any;
  isLoading:boolean=true;
  nationality:string|undefined;

  constructor(private apiService:ApiService,private authService: AuthService) {

    forkJoin([this.getUserInfo(),this.getUserNationality()])
    .pipe(finalize(() => this.isLoading = false))
    .subscribe();

  }

  getUserInfo(){
    var request= this.apiService.get('Consumer/GetInfo');

    return request.pipe(tap(response=>{
      this.userInfo=response.data;
    }));
  }

  getUserNationality(){
    
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': 'ar-JO',
      'Password': 'LASU2zapNIrqJAVX',
    });

    var request= this.apiService.get(`api/Individual/GetPersonalInfo?NationalID=${this.authService.getNationalNumber()}`,'http://appv4.sanad.gov.jo/',headers);

    return request.pipe(
      tap(response => {
        this.nationality=response.nationalty;
      }
    ));
  }


}
