import { Component } from '@angular/core';
import { ApiService } from 'src/services/apiService';

@Component({
  selector: 'app-recipt',
  templateUrl: './recipt.component.html',
  styleUrls: ['./recipt.component.css']
})
export class ReciptComponent {

  requests:any[]=[];
  pages: number[] = [];
  currentIndex=1;

  constructor(private apiService:ApiService) {
   
    this.fillRequest();

  }

  fillRequest(){
    var request=this.apiService.get('InvestmentBilling/GetAllBillingRequests','http://investment.dev.test.jo/api');

    request.subscribe(response=>{
      this.requests=response.records;

      
      for (let i = 1; i <= response.totalPages; i++) {
        this.pages.push(i);
      }

      console.log(response);
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
    var request=this.apiService.get(`InvestmentBilling/GetAllBillingRequests?PageNumber=${index}`,'http://investment.dev.test.jo/api');

    this.currentIndex=index;

    request.subscribe(response=>{
      this.requests=response.records;
    });
  }


}
