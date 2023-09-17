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
  serviceCard:any;
  selectedServiceId:string="";
  sectionName:string="";
  index=0;

  constructor(private apiService:ApiService,private route: ActivatedRoute) {
    if (this.route.snapshot.queryParams['SectionId']) {
      const value = this.route.snapshot.queryParamMap.get('SectionId');
      if(value!=null){
        var request= this.apiService.get('categorization/GetServicesWithSectionId?id='+value);
        request.subscribe(response=>{
          var data=response.data;
          this.services=data;
        });

        this.getSectionName();

      }else{
        location.href='/Entities';
        return;
      }
    }

    if (this.route.snapshot.queryParams['index']) {
      this.index=Number(this.route.snapshot.queryParamMap.get('index')!);
    }

  }

  getSectionName(){

    if (this.route.snapshot.queryParams['MainSectionId']) {

      var mainectionId=this.route.snapshot.queryParamMap.get('MainSectionId')!;

      var request= this.apiService.get(`categorization/GetSectionsWithEntityId?id=${mainectionId}`);

      request.subscribe(response=>{
        var sections=response.data as any[];

        var section=sections.filter(x=>x.id==this.route.snapshot.queryParams['SectionId'])[0];

        this.sectionName=section.name;
        
      })
    }
  }
  
  ngOnInit(): void {

  }

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

  openDialog(serviceId:string,shouldShow:boolean){

    if(shouldShow==false){
      this.goToForm(serviceId);
      return;
    }

    var service=this.services.filter(x=>x.id==serviceId)[0];
    this.serviceCard=service.serviceCard;
    this.selectedServiceId=serviceId;
  }

  goToForm(serviceId:string){
    const SectionId = this.route.snapshot.queryParamMap.get('SectionId');
    location.href=`/Form?BluePrintId=${serviceId}&SectionId=${SectionId}`;
  }

  
}
