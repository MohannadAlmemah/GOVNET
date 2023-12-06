import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { AuthService } from "src/services/auth.service";

@Injectable({
    providedIn: 'root'
})

export class ConsumerGuard implements CanActivate {
    constructor(private router: Router,private cookieService: CookieService,private authService:AuthService) { }
   
    canActivate() {
      const token = this.authService.getToken();

      var role=this.authService.getRole();

      if (token) {
        // Token exists, user is authorized to access the requested route
        return true;
      } else {
        // Token is missing, user is not authorized to access the requested route
        this.router.navigate(['/Investment/login']);
        return false;
      }
    }
  }
  