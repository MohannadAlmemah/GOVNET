import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/apiService';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ServicesComponent implements OnInit {

  services:any[]=[];

  constructor(private apiService:ApiService,private route: ActivatedRoute) {
    if (this.route.snapshot.queryParams['SectionId']) {
      const value = this.route.snapshot.queryParamMap.get('SectionId');
      if(value!=null){
        var request= this.apiService.get('categorization/GetServicesWithSectionId?id='+value);
        request.subscribe(response=>{
          var data=response.data;
          this.services=data;
        });
      }else{
        location.href='/Entities';
        return;
      }
    }
  }
  
  ngOnInit(): void {

  }

  goToForm(ServiceId:number){
    const SectionId = this.route.snapshot.queryParamMap.get('SectionId');
    location.href=`/Form?BluePrintId=${ServiceId}&SectionId=${SectionId}`;
  }

  
}
