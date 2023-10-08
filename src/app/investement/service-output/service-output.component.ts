import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/apiService';

@Component({
  selector: 'app-service-output',
  templateUrl: './service-output.component.html',
  styleUrls: ['./service-output.component.css']
})
export class ServiceOutputComponent {

  serviceId:string|undefined;
  serviceType:string|undefined;
  outputs:any[]=[];

  constructor(private apiService:ApiService,private route: ActivatedRoute) {
   
    if(this.route.snapshot.queryParams['serviceId'] && this.route.snapshot.queryParams['serviceType']){
      this.serviceId=this.route.snapshot.queryParams['serviceId'];
      this.serviceType=this.route.snapshot.queryParams['serviceType'];

      this.getOutputs();
    }else{
      location.href="Investment/Dashboard";
    }

  }

  getOutputs(){
    var request=this.apiService.get(`carboncopies/GetOutputService?serviceId=${this.serviceId}&type=${this.serviceType}`);
    
    request.subscribe(response=>{

      var data=response.data as any[];

      if(response.statusCode==200){
        this.outputs=data;
      }else{
        location.href="Investment/Dashboard";
      }

    })
  }

  
  downloadFile(fileName:string,data: any,fileFormat:string): void {
    const linkSource = 'data:'+fileFormat+';base64,'+data;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  downloadMinioFile(objectId:string){
    var request=this.apiService.get(`Minio/GetFile?ObjectName=${objectId}`);
    request.subscribe(response=>{

      this.downloadFile(response.data?.objectstat?.objectName,response.data.data,response.data?.objectstat?.contentType);

    })
  }

}
