import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {jqueryScript} from '../../../assets/vendor/jquery/jquery-3.3.1.min.js'
import {mainjs} from '../../../assets/libs/js/main-js.js';
import {dashboard} from '../../../assets/libs/js/dashboard-ecommerce.js';
import {bootstrapBundle} from '../../../assets/vendor/bootstrap/js/bootstrap.bundle.js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {
    jqueryScript();
    bootstrapBundle();
    mainjs();
    dashboard();
  }

}
