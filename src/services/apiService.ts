import { Inject, Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, map, switchMap, take, throwError, timer } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
// import { AuthService } from 'src/app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.govnet;

  private readonly intervalDuration = 12 * 60 * 1000 + 30 * 1000; // 14 min and 30 sec
  private nextCallTimeKey = 'next_api_call_time';
  private initializationComplete = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient,private authService:AuthService,private inject:Injector) {

  }


  initializeTimer(): void {
    
    const now = Date.now();
    let nextCallTime = parseInt(localStorage.getItem(this.nextCallTimeKey)!, 10);

    if(localStorage.getItem(this.nextCallTimeKey) == null){
      if (!nextCallTime || nextCallTime < now) {
        debugger;
        nextCallTime = now + this.intervalDuration;
        localStorage.setItem(this.nextCallTimeKey, nextCallTime.toString());
      }
    }
  
    const delay = nextCallTime - now ;

    timer(delay, this.intervalDuration).pipe(
      switchMap(() => this.callApi())
    ).subscribe(response=>{
      

      if(response.statusCode==200){
        this.authService.setToken(response.data.id_token);
        this.authService.setRefreshToken(response.data.refresh_token);
      }else if(response.statusCode==400 || response.statusCode==401){
        this.authService.removeToken();
        location.href="/Investment/login";
      }

    });

    setTimeout(() => {
      this.initializationComplete.next(true);
    }, 2000);

  }

  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Password': 'LASU2zapNIrqJAVX',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': 'ar-JO'
    });
  
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  
    return headers;
  }

  private callApi(): Observable<any> {
    const nextCallTime = Date.now() + this.intervalDuration;
    localStorage.setItem(this.nextCallTimeKey, nextCallTime.toString());

    return  this.http.post(`${environment.govnet}/auth/IdmRefreshToken`, { "refreshToken" : this.authService.getRefreshToken() });
  }

  // GET request
  get(endpoint: string,apiUrl:string=this.apiUrl, headers?: HttpHeaders): Observable<any> {
    const url = `${apiUrl}/${endpoint}`;

    return this.initializationComplete.pipe(
      filter(initialized => initialized),
      take(1),
      switchMap(() => {
        const headers = this.createHeaders();
        return this.http.get<any>(`${apiUrl}/${endpoint}`, { headers });
      })
    );

  }


  post(endpoint: string, data: any,apiUrl:string=this.apiUrl, headers?: HttpHeaders): Observable<any> {
    
    return this.initializationComplete.pipe(
      filter(initialized => initialized),
      take(1),
      switchMap(() => {
        const headers = this.createHeaders();
        return this.http.post(`${apiUrl}/${endpoint}`, data, { headers });
      })
    );
  }


  userFromIdm(data:any):Observable<any>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'*',
      'Accept-Language':'ar-JO',
      'idm-token':data.access_token,
      'Authorization': data.id_token,
    });


    var body={
      "deviceToken": ""
    }

    var request= this.post('auth/UserFromIdm',body,environment.govnet,headers);

    return request;

    // request.subscribe(idmResponse=>{

    //   console.log(idmResponse);

    //   if(idmResponse.statusCode==200){

    //       this.authService.setToken(data.data.access_token);
    //       this.authService.setRefreshToken(data.refresh_token);
    //       this.authService.setNationalNumber(this.username!);

    //       location.href='/Investment/Dashboard';

    //   }else{
    //     this.sweetAlertService.ShowAlert('error',idmResponse.message);
    //   }

    // });
  }

  // login(username:string,password:string): Observable<HttpResponse<any>> {
    
  //   const url = `https://${environment.idm}/mga/sps/oauth/oauth20/token`;

  //   const formData = new FormData();


  //   const body = new HttpParams()
  //   .set('grant_type','password')
  //   .set('client_secret','k22DtPUNkpFbO3JqCDwn')
  //   .set('client_id','HrFZUo8o6dg4gUDzkYAi')
  //   .set('username',username)
  //   .set('password',password)
  //   .set('scope','openid');

  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       "Access-Control-Allow-Origin": "*",
  //     }),
  //     observe: 'response' as const
  //   };

  //   return this.http.post<HttpResponse<any>>(url, body.toString(), httpOptions);
  // }

  uploadFile(file: File,carbonCopyId:string){

    const formData = new FormData();

    console.log(file);
    formData.append('Id',carbonCopyId);
    formData.append('File', file);

    const httpOptions = {
      headers: new HttpHeaders({
        'enctype': 'multipart/form-data',
        'Accept-Language':'en-US',
        'Authorization': this.authService.getToken()!=undefined ? `Bearer ${this.authService.getToken()}` :'',
      })
    };

    return this.http.post(`${environment.govnet}/Minio/UploadFile`, formData, httpOptions)
      .pipe(
        map(response => {
          // Handle your response here
          return response;
        }),
        catchError(error => {
          console.error(error);
          return [false];
        })
      );
  }

    
}


