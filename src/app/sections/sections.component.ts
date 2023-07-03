import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/apiService';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent {

  sections:any[]=[];
  SectionId:string|undefined;

  constructor(private apiService:ApiService,private route: ActivatedRoute) {

  }
  
  ngOnInit(): void {
    if (this.route.snapshot.queryParams['SectionId']) {
      const value = this.route.snapshot.queryParamMap.get('SectionId');
      if(value!=null){
        var request= this.apiService.get('categorization/GetSectionsWithEntityId?id='+value);
        request.subscribe(response=>{
          var data=response.data;
          this.sections=data;
        });
      }else{
        location.href='/Entities';
        return;
      }
    }
  }


  
}