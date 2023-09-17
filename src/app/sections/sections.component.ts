import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/apiService';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent {

  sections:any[]=[];
  sectionId:string|undefined;

  colorArr:string[]=[
    'bg-gold-2',
    'bg-maroon',
    'bg-gold',
    'bg-green',
    'bg-blue',
    'bg-red',
    'bg-blue',
    'bg-gold',
    'bg-green',
  ];

  textColorArr:string[]=[
    "text-gold-2",
    'text-maroon',
    'text-gold',
    'text-green',
    'text-blue',
    'text-red',
    'text-blue',
    'text-gold',
    'text-green',
  ];

  imagesArr:string[]=[
    '../../assets/images/window.png',
    '../../assets/images/investor.png',
    '../../assets/images/motiviation.png',
    '../../assets/images/build.png',
    '../../assets/images/ease.png',
    '../../assets/images/jordan-star.png',
    '../../assets/images/grievance.png',
    '../../assets/images/invest-box.png',
    '../../assets/images/one-approval.png',
  ];

  constructor(private apiService:ApiService,private route: ActivatedRoute,private authService:AuthService) {

  }
  
  ngOnInit(): void {

    if (this.route.snapshot.queryParams['SectionId']) {
      this.sectionId = this.route.snapshot.queryParamMap.get('SectionId')!;
      if(this.sectionId!=null){
        var request= this.apiService.get(`categorization/GetSectionsWithEntityId?id=${this.sectionId}`);
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