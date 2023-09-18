import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
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

  uploadFile(file: File,carbonCopyId:string){

    const formData = new FormData();

    console.log(file);
    formData.append('CarbonCopyId',carbonCopyId);
    formData.append('File', file);

    const httpOptions = {
      headers: new HttpHeaders({
        'enctype': 'multipart/form-data',
        'Accept-Language':'en-US',
        'Authorization': this.token!=undefined ? `Bearer ${this.token}` :'',
      })
    };

    return this.http.post('https://stagingapp.sanad.gov.jo/api/Minio/UploadFile', formData, httpOptions)
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

    // const url = 'https://stagingapp.sanad.gov.jo/api/Minio/UploadFile';


    // const formData = new FormData();

    // formData.append('carbonCopyId','12');
    // formData.append('file',file,file.name);

    // const headers = new HttpHeaders({
    //   // Ensure you set the 'Content-Type' header to 'multipart/form-data'.
    //   'Content-Type': 'multipart/form-data',
    //   'Accept-Language':'ar-JO',
    //   'Authorization': this.token!=undefined ? `Bearer ${this.token}` :'',
    // });

    // this.http.post(url, formData ,{headers}).subscribe(
    //   (response) => {
    //     console.log(response);
    //   }
    // );
  }


