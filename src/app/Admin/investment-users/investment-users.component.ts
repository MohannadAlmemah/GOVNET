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
  investmentName:string|undefined;

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
    var request=this.apiService.get('Company/GetAllInvestorsRequests?','http://investment.dev.test.jo/api');

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
