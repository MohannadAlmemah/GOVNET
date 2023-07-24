import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/apiService';
import { SweetAlertService } from 'src/services/sweetAlertService';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent {

  requests:any[]=[];
  userId:string="9831025503";
  constructor(private apiService:ApiService,private route: ActivatedRoute,
    private sweetAlertService:SweetAlertService
    ) {

      this.fillRequests();

    // this.myForm=new UntypedFormGroup({});
    // this.files=[];
    // this.fields=[];
    
  }

  fillRequests(){
    var request=this.apiService.get(`carboncopies/GetUserServices?userId=${this.userId}`);

    request.subscribe(response=>{
      var data=response.data;
      this.requests=data;
    });

  }

}
