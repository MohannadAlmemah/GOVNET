import { Component } from '@angular/core';
import { ApiService } from 'src/services/apiService';

@Component({
  selector: 'app-investment-users',
  templateUrl: './investment-users.component.html',
  styleUrls: ['./investment-users.component.css']
})
export class InvestmentUsersComponent {


  requests:any[]=[];
  pages: number[] = [];
  currentIndex=1;
  userName:string|undefined="";
  nameEn:string|undefined="";
  nameAr:string|undefined="";
  nationality	:string|undefined="";
  mobil:string|undefined="";
  constructor(private apiService:ApiService) {
   
    this.fillRequest();

  }

  fillRequest(){
    var request=this.apiService.get('Company/GetAllInvestorsRequests','http://investment.dev.test.jo/api');

    request.subscribe(response=>{
      this.requests=response.records;

      
      for (let i = 1; i <= response.totalPages; i++) {
        this.pages.push(i);
      }
    });

  }


  search(){

    this.pages=[];

    var url="Company/GetAllInvestorsRequests?";

    if(this.userName!=""){
      url+=`NationalId=${this.userName}&`;
    }

    if(this.nameEn!=""){
      url+=`NameEn=${this.nameEn}&`;
    }

    if(this.nameAr!=""){
      url+=`NameAr=${this.nameAr}&`;
    }

    if(this.nameAr!=""){
      url+=`NameAr=${this.nameAr}&`;
    }

    if(this.nationality!=""){
      url+=`Nationality=${this.nationality}&`;
    }

    if(this.mobil!=""){
      url+=`Mobile=${this.mobil}&`;
    }

    var request=this.apiService.get(url,'http://investment.dev.test.jo/api');

    request.subscribe(response=>{
      this.requests=response.records;

      
      for (let i = 1; i <= response.totalPages; i++) {
        this.pages.push(i);
      }
    });

  }


  goNextIndex(){

    if(this.currentIndex<this.pages.length){
      var newIndex=this.currentIndex+1;
  
      this.updatePagination(newIndex);
    }
  }

  goPrevIndex(){

    if(this.currentIndex!=1){

      var newIndex=this.currentIndex-1;

      this.updatePagination(newIndex);
    }
  }


  updatePagination(index:number){
    var request=this.apiService.get(`Company/GetAllInvestorsRequests?PageNumber=${index}`,'http://investment.dev.test.jo/api');

    this.currentIndex=index;

    request.subscribe(response=>{
      this.requests=response.records;
    });
  }


}
