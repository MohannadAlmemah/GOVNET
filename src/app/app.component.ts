import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/services/apiService';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  date:any;
  title = 'GovNet';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.initializeTimer();
  }
  
  // currentLanguage: string|undefined;
  // globalTranslations: any;

  // constructor(private translateService:TranslateService,private cookieService: CookieService) {
  //   // translateService.setDefaultLang('ar');

  //   // translateService.addLangs(['en', 'ar']);

  //   // const browserLang = translateService.getBrowserLang( );

  //   // translateService.use(browserLang && browserLang.match(/en|ar/) ? browserLang : 'ar');

  //   // this.currentLanguage = this.cookieService.get('language') || this.translateService.getBrowserLang();
  //   // this.translateService.setDefaultLang('en');
  //   // this.translateService.use(this.currentLanguage!);
  //   // this.translateService.getTranslation(this.currentLanguage!).subscribe(translations => {
  //   //   this.globalTranslations = translations;
  //   // });



  // }
}
