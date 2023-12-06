import { Injectable, Injector } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Import your AuthService
import { CookieService } from 'ngx-cookie-service'; // Import CookieService
import { ApiService } from 'src/services/apiService';
import { SweetAlertService } from 'src/services/sweetAlertService';
import axios from 'axios';

@Injectable()

export class TokenInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService,private inject: Injector,private apiService:ApiService,private sweetAlertService:SweetAlertService) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //return next.handle(request);
    
    return next.handle(request).pipe(
      tap((response:any):any=>{

        try{
          if(response.body?.statusCode!=undefined){


            if(response.body?.statusCode>=400 && response.body?.statusCode!=401){
              this.sweetAlertService.ShowAlert('error',response.body.message??'حدث خطأ يرجى المحاولة مره اخرى');
            }else if(response.body?.statusCode==401){
              this.apiService.initializeTimer();
              setTimeout(() => {
                  location.reload();
              }, 1500);
            }
  
            // if (response.body?.statusCode === 401 && !request.url.includes('auth/IdmRefreshToken')) {
  
            //   return this.handleRefrehToken(request, next).subscribe();
            // }
            // else if(response.body?.statusCode==400){
            //   this.sweetAlertService.ShowAlert('error',response.body.message??'حدث خطأ يرجى المحاولة مره اخرى');
            // }
  
          }

        }catch(err){
          this.sweetAlertService.ShowAlert('error',response.body.message??'حدث خطأ يرجى المحاولة مره اخرى');
        }



      })
    );

  }

  handleRefrehToken(request: HttpRequest<any>, next: HttpHandler) {
    return this.apiService.post('auth/IdmRefreshToken',{ "refreshToken" : this.authService.getRefreshToken() }).pipe(
      switchMap((response: any) => {

        debugger;
        this.authService.setToken(response.data.id_token);
        this.authService.setRefreshToken(response.data.refresh_token);
        return next.handle(this.AddTokenheader(request,response.data.id_token))
      }),
      catchError(errodata=>{
        
        this.authService.removeToken();
        location.href="/Investment/login";
        return throwError(errodata)
      })
    );
  }

  AddTokenheader(request: HttpRequest<any>, token: any) {
    return request.clone({ headers: request.headers.set('Authorization', 'bearer ' + token) });
  }

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return next.handle(request).pipe(

  //     tap((response:any):any=>{

        
  //         try{
            
  //           if(response.body?.statusCode!=undefined){
 
  //             if(response.body?.statusCode==401){

  //               var refreshTokenRequest= this.apiService.post('auth/IdmRefreshToken',{ "refreshToken" : this.authService.getRefreshToken() });
    
  //              refreshTokenRequest.subscribe(refreshTokenResponse=>{

  
  //              if(refreshTokenResponse.statusCode==200){

  //               this.authService.removeToken2();
    
  //                 this.authService.setToken(refreshTokenResponse.data.id_token);
  //                 this.authService.setRefreshToken(refreshTokenResponse.data.refresh_token);

  //                 setTimeout(() => {
  //                     location.reload();
  //                 }, 1000);

  //               }
  //               else if(refreshTokenResponse.statusCode==400 || refreshTokenResponse.statusCode==401){

  //                 this.authService.removeToken();
  //                 location.href="/Investment/login";
  //               }
  //               });
  //             }
  //             else if(response.body?.statusCode>=400){
  //               this.sweetAlertService.ShowAlert('error',response.body.message??'حدث خطأ يرجى المحاولة مره اخرى');
  //             }
  //         }else{

  //         }

  //         }catch(ex){

  //           this.sweetAlertService.ShowAlert('error','حدث خطأ يرجى المحاولة مره اخرى');

  //           console.log(ex);

  //         }


          
  //     }),
  //   );
  // }  
}

