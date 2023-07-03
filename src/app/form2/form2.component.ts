import { Component } from '@angular/core';
import { ApiService } from 'src/services/apiService';

@Component({
  selector: 'app-form2',
  templateUrl: './form2.component.html',
  styleUrls: ['./form2.component.css']
})
export class Form2Component {
  
  fileds:any[]
  constructor(private apiService:ApiService) {
    this.fileds=[]
  }

}
