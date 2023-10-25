import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, finalize, tap } from 'rxjs';
import { ApiService } from 'src/services/apiService';
import { AuthService } from 'src/services/auth.service';
import { SweetAlertService } from 'src/services/sweetAlertService';

@Component({
  selector: 'app-investment-dashboard',
  templateUrl: './investment-dashboard.component.html',
  styleUrls: ['./investment-dashboard.component.css']
})
export class InvestmentDashboardComponent {

  currentServices: any[] = [];
  archiveService: any[] = [];
  compaines: any[] = [];
  isLoading: boolean = true;

  companyLoading: boolean = true;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private sweetAlertService: SweetAlertService,
    private authService: AuthService
  ) {
    // Use forkJoin to combine both observables and finalize to update isLoading
    forkJoin([this.fillCurrentServicesForConsumer()])
      .pipe(finalize(() => this.isLoading = false))
      .subscribe();


      
    setTimeout(() => {
      
      const tabs = document.querySelectorAll('[data-role="tab"]'),
    tabContents = document.querySelectorAll(".tab-panel");
    
    tabs.forEach((tab:any) => {
      tab.addEventListener("click", () => {
        const target = document.querySelector(tab?.dataset?.target);
    
        tabContents.forEach((tc) => {
          tc.classList.remove("is-active");
        });
        target.classList.add("is-active");
    
        tabs.forEach((t) => {
          t.classList.remove("is-active");
        });
        tab.classList.add("is-active");
      });
    });

    }, 2000);

    this.getCompanies();

  }



  getCompanies() {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': 'ar-JO',
      'Password': 'LASU2zapNIrqJAVX',
      'Authorization': this.authService.getToken() != undefined ? `Bearer ${this.authService.getToken()}` : '',
    });

    var request= this.apiService.get('Investment/GetCompanyAuthorizationData?NationalId=' + this.authService.getNationalNumber(), 'https://appv4.sanad.gov.jo/api', headers);

    request.subscribe(response=>{
      var data = response.list;
      this.compaines = data;
      this.companyLoading=false;
      
    });

  }

  fillCurrentServicesForConsumer() {
    return this.apiService.get(`carboncopies/GetCurrentServicesForConsumer?SortOrder=desc`)
      .pipe(
        tap(response => {
          if(response.statusCode == 200) {
          var requests = response.data as any[];
          var data = requests as any;
          this.currentServices = data.items;
        }
        }),
      );
  }

  runFillCurrentServicesForConsumer(){
    this.isLoading=true;

    this.fillCurrentServicesForConsumer().subscribe(response=>{
      this.isLoading=false;
    });
  }

  fillArchiveServicesForConsumer() {

    this.isLoading=true;

     var request = this.apiService.get(`carboncopies/GetArchivedServicesForConsumer?SortOrder=desc`);

     request.subscribe(response=>{

      var requests = response.data as any[];
      var data = requests as any;
      this.archiveService = data.items;

      this.isLoading=false;
     })

      
  }

  showRejectedType(id:string){
    var archiveService=this.archiveService.filter(x=>x.id==id)[0];

    this.sweetAlertService.ShowAlert('info',archiveService.rejectReason??"");
  }


}

