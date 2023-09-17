import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/apiService';

@Component({
  selector: 'app-filter-requests',
  templateUrl: './filter-requests.component.html',
  styleUrls: ['./filter-requests.component.css']
})
export class FilterRequestsComponent {

  requests:any[]=[];
  pages: number[] = [];
  currentIndex=1;
  applicationNumber:string|undefined;
  applicationType:string|undefined;
  comapny:string|undefined;
  status:string|undefined;
  createdDate:string|undefined;
  endDate:string|undefined;

  constructor(private apiService:ApiService,private route: ActivatedRoute) {
   
    this.fillRequest();

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

  fillRequest(){

    var url="";

    if(this.route.snapshot.queryParams['finish']){
      console.log(1);
      url="Provided/FilterLogService?EndDate=12/15/1997";
    }else{
      url="Provided/FilterLogService";
    }

    var request=this.apiService.get('Provided/FilterLogService','http://investment.dev.test.jo/api');

    request.subscribe(response=>{
      this.requests=response.records;

      for (let i = 1; i <= response.totalPages; i++) {
        this.pages.push(i);
      }

      console.log(response);
    });



  }

  updatePagination(index:number){
    var request=this.apiService.get(`Provided/FilterLogService?PageNumber=${index}`,'http://investment.dev.test.jo/api');

    this.currentIndex=index;

    request.subscribe(response=>{
      this.requests=response.records;
    });
  }

  search(){
    var request=this.apiService.get(`Provided/FilterLogService?EstablishmentName=${this.comapny??null}&`,'http://investment.dev.test.jo/api');

    request.subscribe(response=>{

      this.pages=[];

      console.log(response);

      this.requests=response.records;

      // EndDate=${this.endDate??null}&
      // EstablishmentName=${this.comapny??null}&

      for (let i = 1; i <= response.totalPages; i++) {
        this.pages.push(i);
      }

    });
  }



}
