import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, forkJoin, tap } from 'rxjs';
import { ApiService } from 'src/services/apiService';

@Component({
  selector: 'app-investment-user-view',
  templateUrl: './investment-user-view.component.html',
  styleUrls: ['./investment-user-view.component.css']
})
export class InvestmentUserViewComponent {

  userInfo:any;
  isLoading=true;
  userNatId:string|undefined;

  constructor(private apiService:ApiService,private route: ActivatedRoute) {

    if(this.route.snapshot.queryParams['id']){
      this.userNatId =this.route.snapshot.queryParamMap.get('id')!;

      forkJoin([this.getPersonalInfo()])
      .pipe(finalize(() => this.isLoading = false))
      .subscribe();
      
    }
    

  }

  getPersonalInfo(){

    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': 'ar-JO',
      'Password': 'LASU2zapNIrqJAVX',
    });

    return this.apiService.get(`Individual/GetPersonalInfo?NationalID=${this.userNatId}`, 'https://appv4.sanad.gov.jo/api', headers)
      .pipe(
        tap(response => {
          this.userInfo = response;
        })
      );

  }
}
