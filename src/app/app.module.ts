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
import { Form2Component } from './form2/form2.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {  ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    FormComponent,
    Form2Component
  ],
  imports: [
    ReactiveFormsModule,
    ToastModule,
    FileUploadModule,
    CommonModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CalendarModule,
    RouterModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
