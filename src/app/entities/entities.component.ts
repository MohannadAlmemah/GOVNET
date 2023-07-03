import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/apiService';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css']
})
export class EntitiesComponent implements OnInit {

  services:any[]=[];

  constructor(private apiService:ApiService) {

  }
  
  ngOnInit(): void {
    var request=this.apiService.get('categorization/GetAllEntities');
    request.subscribe(res=>{
      if(res.statusCode==200){
        this.services=res.data;
      }
    });
  }


  
}
