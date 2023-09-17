import { Component } from '@angular/core';
import { ApiService } from 'src/services/apiService';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent {

  
  requests:any[]=[];
  pages: number[] = [];
  currentIndex=1;

  constructor(private apiService:ApiService) {
   
    this.fillRequest();

  }

  fillRequest(){
    var request=this.apiService.get('Company/GetAllCompanyRequests','http://investment.dev.test.jo/api');

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
    var request=this.apiService.get(`Company/GetAllCompanyRequests?PageNumber=${index}`,'http://investment.dev.test.jo/api');

    this.currentIndex=index;

    request.subscribe(response=>{
      this.requests=response.records;
    });
  }

}
