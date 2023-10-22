import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,private cookieService: CookieService) {

  }

  private apiUrl = 'https://stagingapp.sanad.gov.jo/api';

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/api/user/login`;
    const body = { email, password };
    return this.http.post<any>(url, body);
  }

  getToken(): string | null {
    return this.cookieService.get('token');
  }

  getRefreshToken(): string | null {
    return this.cookieService.get('refreshToken');
  }

  getRole(): string | null {
    return this.cookieService.get('role');
  }

  getNationalNumber(): string | null {
    return this.cookieService.get('nationalNumber');
  }

  setToken(token: string): void {
    this.cookieService.set('token', token,1,'/');
  }

  setRole(role: string): void {
    this.cookieService.set('role', role ,1,'/');
  }

  setRefreshToken(token: string): void {
    this.cookieService.set('refreshToken', token,1,'/');
  }

  setNationalNumber(natNumber: string): void {
    this.cookieService.set('nationalNumber', natNumber,1,'/');
  }

  removeToken(): void {
    this.cookieService.delete('token','/');
    this.cookieService.delete('refreshToken','/');
    this.cookieService.delete('nationalNumber','/');
    this.cookieService.delete('role','/');
  }

  removeToken2(): void {
    this.cookieService.delete('token','/');
    this.cookieService.delete('refreshToken','/');
  }


  refreshToken() {
    var accessToken = this.cookieService.get('token');
    return this.http.post<any>(`${this.apiUrl}/api/auth/RefreshToken`, { token:accessToken, refreshToken: this.cookieService.get('refresh_token') })
      .pipe(
        tap(response => {

          alert('check token');

          if(response.code==200){
            var data= response.data[0];
  
            this.cookieService.set('token', data.token);
            this.cookieService.set('refresh_token', data.refreshToken);
          }else{
            this.removeToken();
            location.href="/login";
          }


        })
      );
  }

  refreshAccessToken() {
    // Replace with your actual refresh token logic
    const refreshToken = this.getRefreshToken();

    return this.http.post('https://stagingapp.sanad.gov.jo/api/auth/RefreshToken', { "refreshToken" : refreshToken }).pipe(
      catchError(error => {
       
        this.removeToken();

        //location.href="Investment/login";
        
        return throwError(error);
      }),

      tap((response:any) => {
        
        this.removeToken();
        this.setToken(response.access_token);
        this.setRefreshToken(response.refresh_token);

      })
    );
  }

}
