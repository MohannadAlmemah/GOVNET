import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Delegate } from 'src/app/models/companyProfile/Delegate';
import { Director } from 'src/app/models/companyProfile/Director';
import { Member } from 'src/app/models/companyProfile/Member';
import { Objectives } from 'src/app/models/companyProfile/Objectives';
import { ApiService } from 'src/services/apiService';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent {

  isLoading=true;
  companyId:string|undefined="";
  regno:string|undefined="";
  companame:string|undefined="";
  regdate:string|undefined="";
  typearabicname:string|undefined=""
  compstat:string|undefined=""
  governatE_DESC:string|undefined=""
  registeredcap:string|undefined=""
  totalcapital:string|undefined=""
  delegates:Delegate[]=[];
  members:Member[]=[];
  boardOfDirectors:Director[]=[];
  objectives:Objectives[]=[];

  constructor(private apiService:ApiService,private route: ActivatedRoute) {
    
    if(this.route.snapshot.queryParams['id']){

      var companyId=this.route.snapshot.queryParamMap.get('id')!;
      
      var headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Accept-Language': 'ar-JO',
        'Password': 'LASU2zapNIrqJAVX',
      });
  

      if(companyId.startsWith("2")){
        var request=this.apiService.get(`Investment/GetCCdCompanyData?CompanyNationalId=${companyId}`,'http://appv4.sanad.gov.jo//api',headers);

        request.subscribe(response=>{

          this.isLoading=false;

          if(response?.comid!=0){

            this.companyId=response?.iD_NUMBER;
            this.regno=response?.regno;
            this.companame=response?.companame;

            this.regdate =  response?.regdate !=null ? new DatePipe('en-US').transform(response?.regdate, 'dd/MM/yyyy')! : "";

            this.totalcapital=response?.totalcapital;
            this.typearabicname=response?.typearabicname;
            this.compstat=response?.compstat;
            this.governatE_DESC=response?.governatE_DESC;
            
            var objectives=response?.objectives as any[];

            objectives?.map(objective=>{
              this.objectives.push(new Objectives(objective.objectid,objective.objecT_DESC));
            });

            var members=response?.members as any[];

            members?.map(member=>{
              this.members.push(new Member(member.idnumber,member.memberaname,member.sharespaid,member.nationality,member.membercat));
            });

            var boardOfDirectors=response?.boardOfDirectors as any[];

            boardOfDirectors?.map(director=>{

              this.boardOfDirectors.push(new Director(director.memcategory,director.memberaname,director.starT_ELECTION,director.enD_ELECTION,director.entity));

            });

            var delegates=response?.authorizations as any[];

            delegates?.map(delegate=>{
              this.delegates.push(new Delegate(delegate.autH_DATE,delegate.author));
            });

          }else{
            location.href="Investment/Dashboard";
          }


        });

      }
      else if(companyId.startsWith("1")){
        var request=this.apiService.get(`Investment/GetMITCompanyData?CompanyNationalId=${companyId}`,'http://appv4.sanad.gov.jo//api',headers);

        request.subscribe(response=>{

          if(response?.hasData){

            this.companame=response?.strRegistryName;
            this.companyId=response?.intID_Number;
            this.typearabicname="فرديه";
            this.governatE_DESC=response?.strGovernorateName;
            this.regno=response?.intIndv_ID;
            this.totalcapital=response?.decCapitalValue??response?.decCapitalValue2;
            
            this.compstat=response?.strRegistryStatus;
  
            var objectives=response?.strRegisteryPurposes as any[];
  
            objectives?.map(objective=>{
              this.objectives.push(new Objectives(objective.aims_code,objective.aim_desc));
            });
  
            var delegates=response?.delegates as any[];
  
            delegates?.map(delegate=>{
              this.delegates.push(new Delegate(delegate.delegatE_IDENT_ISSUING_DATE?? null,delegate?.delegate_authority+" - " + delegate?.delegate_name));
            });

            this.regdate=response?.dtmRegistryDate;

          }else{
            location.href="Investment/Dashboard";
          }

          this.isLoading=false;

        });

      }else{

      }

    }else{
      location.href='/Investment/Dashboard';
      return;
    }

  }


}
