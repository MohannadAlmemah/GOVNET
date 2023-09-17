import { Component } from '@angular/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {


  constructor(private authService:AuthService,) {
    
  }

  logout(){
    this.authService.removeToken();
    location.href="/Investment/login";
  }

}
