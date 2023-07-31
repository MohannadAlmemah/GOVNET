import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarModule } from 'primeng/calendar';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FormComponent } from './form/form.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {  ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ServicesComponent } from './services/services.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { EntitiesComponent } from './entities/entities.component';
import { SectionsComponent } from './sections/sections.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { LoginComponent } from './login/login.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { ServciesLayoutComponent } from './layouts/servcies-layout/servcies-layout.component';
import { TestComponent } from './test/test.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { InvestmentDashboardComponent } from './investement/investment-dashboard/investment-dashboard.component';
import { InvestmentProfileComponent } from './investement/investment-profile/investment-profile.component';
import { LoginInvestmentComponent } from './investement/login-investment/login-investment.component';
import { InvestementSignupComponent } from './investement/investement-signup/investement-signup.component';
import { InvestmentForgetPasswordComponent } from './investement/investment-forget-password/investment-forget-password.component';

registerPlugin(FilePondPluginFileValidateType);

// export function HttpLoaderFactory(http: HttpClient) {
// 	return new TranslateHttpLoader(http, './assets/languages/', '.json');
// }


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    FormComponent,
    ServicesComponent,
    EntitiesComponent,
    SectionsComponent,
    LoginComponent,
    LoginLayoutComponent,
    ServciesLayoutComponent,
    TestComponent,
    MyRequestsComponent,
    InvestmentDashboardComponent,
    InvestmentProfileComponent,
    LoginInvestmentComponent,
    InvestementSignupComponent,
    InvestmentForgetPasswordComponent,
  ],
  imports: [
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
    ToastModule,
    FileUploadModule,
    CommonModule,
    HttpClientModule,
    BrowserModule,
    ProgressSpinnerModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CalendarModule,
    RouterModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
    FilePondModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
