import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Import your AuthService
import { CookieService } from 'ngx-cookie-service'; // Import CookieService
import { ApiService } from 'src/services/apiService';

@Injectable()

export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,private apiService:ApiService) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(

      tap((response:any):any=>{

        
          try{

            if(response.body?.statusCode!=undefined){
 
              if(response.body?.statusCode==401){

                this.authService.removeToken();
                location.href="/Investment/login";

                // var refreshTokenRequest= this.apiService.post('auth/RefreshToken',{ "refreshToken" : this.authService.getRefreshToken() });
  
                // //this.authService.removeToken();
  
                // var refreshTokenResponse=refreshTokenRequest.subscribe(refreshTokenResponse=>{
  
  
                //   if(refreshTokenResponse.statusCode!=400){

                //     this.authService.removeToken2();
    
                //     this.authService.setToken(refreshTokenResponse.data.access_token);
                //     this.authService.setRefreshToken(refreshTokenResponse.data.refresh_token);

                //   }else{

                //     this.authService.removeToken();
                //     location.href="Investment/Login";

                //   }
                // });
              }
          }

          }catch(ex){

            console.log(ex);

          }

          
          
      }),
    );
  }  
}

