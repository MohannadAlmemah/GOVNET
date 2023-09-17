import { Component } from '@angular/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-servcies-layout',
  templateUrl: './servcies-layout.component.html',
  styleUrls: ['./servcies-layout.component.css']
})
export class ServciesLayoutComponent {

  /**
   *
   */
  constructor(private authService:AuthService,) {
    
  }

  logout(){
    this.authService.removeToken();
    location.href="/Investment/login";
  }
  
}
