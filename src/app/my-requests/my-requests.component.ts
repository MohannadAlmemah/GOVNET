import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, forkJoin, tap } from 'rxjs';
import { ApiService } from 'src/services/apiService';
import { AuthService } from 'src/services/auth.service';
import { SweetAlertService } from 'src/services/sweetAlertService';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent {

  currentServices: any[] = [];
  archiveService: any[] = [];
  userId:string=this.authService.getNationalNumber()!;
  isLoading: boolean = true;

  constructor(private apiService:ApiService,private route: ActivatedRoute,
    private sweetAlertService:SweetAlertService,private authService:AuthService
    ) {

      forkJoin([this.fillCurrentServicesForConsumer(),this.fillArchiveServicesForConsumer()])
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

  fillArchiveServicesForConsumer() {
    return this.apiService.get(`carboncopies/GetArchivedServicesForConsumer?SortOrder=desc`)
      .pipe(
        tap(response => {
          if(response.statusCode == 200) {
          var requests = response.data as any[];
          var data = requests as any;
          this.archiveService = data.items;
        }
        }),
      );
  }

  showRejectedType(id:string){
    var archiveService=this.archiveService.filter(x=>x.id==id)[0];

    this.sweetAlertService.ShowAlert('info',archiveService.rejectReason??"");
  }

}
