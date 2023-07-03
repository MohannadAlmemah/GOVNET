import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { AuthService } from 'src/app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://stagingapp.sanad.gov.jo/api';

  constructor(private http: HttpClient) { }

  // GET request
  get(endpoint: string): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.get<any>(url);
  }

  // getWithToken(endpoint: string,token:string): Observable<any> {
  //   const url = `${this.apiUrl}/${endpoint}`;
  //   var headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   });
  //   return this.http.get<any>(url,{headers});
  // }

  // POST request
  post(endpoint: string, data: any, headers?: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    if (!headers) {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*',
      });
    }
    return this.http.post(url, data, { headers });
  }


  login(endpoint: string, data: any, headers?: HttpHeaders): Observable<any> {
    
    const url = `${endpoint}`;

    return this.http.post(url, data, { headers });
  }



  // postWithToken(endpoint: string, data: any,token:string=this.authService.getToken()!, headers?: HttpHeaders): Observable<any> {
  //   const url = `${this.apiUrl}/${endpoint}`;
  //   if (!headers) {
  //     headers = new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`
  //     });
  //   }
  //   return this.http.post(url, data, { headers });
  // }
  
}
