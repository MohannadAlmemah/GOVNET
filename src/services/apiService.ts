import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
// import { AuthService } from 'src/app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://stagingapp.sanad.gov.jo/api';

  token:string|undefined;

  constructor(private http: HttpClient,private authService:AuthService) {

    this.token=this.authService.getToken()!;
  }

  // GET request
  get(endpoint: string,apiUrl:string=this.apiUrl, headers?: HttpHeaders): Observable<any> {
    const url = `${apiUrl}/${endpoint}`;

    if (!headers) {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*',
        'Accept-Language':'ar-JO',
        'Authorization': this.token!=undefined ? `Bearer ${this.token}` :'',
      });
    }

    return this.http.get<any>(url,{headers});
  }


  post(endpoint: string, data: any,apiUrl:string=this.apiUrl, headers?: HttpHeaders): Observable<any> {
    const url = `${apiUrl}/${endpoint}`;
    if (!headers) {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*',
        'Accept-Language':'ar-JO',
        'Authorization': this.token!=undefined ? `Bearer ${this.token}` :'',
      });
    }
    return this.http.post(url, data, { headers });
  }

  


  login(endpoint: string, data: any, headers?: HttpHeaders): Observable<any> {
    
    const url = `${endpoint}`;

    return this.http.post(url, data, { headers });
  }


  
}
