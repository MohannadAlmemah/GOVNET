import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

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
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
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
import { FileUploadLimitDirective } from './directives/file-upload-limit.directive';
import { TextFieldComponent } from './form/fields/text-field/text-field.component';
import { TokenInterceptor } from 'src/security/tokenInterceptor';
import { DragComponent } from './drag/drag.component';
import { DialogModule } from 'primeng/dialog';
import { CompanyInfoComponent } from './investement/company-info/company-info.component';
import { FilterRequestsComponent } from './Admin/filter-requests/filter-requests.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ReciptComponent } from './Admin/recipt/recipt.component';
import { CompaniesComponent } from './Admin/companies/companies.component';
import { MultiSelectModule } from 'primeng/multiselect';

import { InvestmentUsersComponent } from './Admin/investment-users/investment-users.component';
import { InvestmentUserViewComponent } from './Admin/investment-user-view/investment-user-view.component';
import { ComboBoxComponent } from './form/fields/combo-box/combo-box.component';
import { PredefinedComboBoxComponent } from './form/fields/predefined-combo-box/predefined-combo-box.component';
import { CHECKBOXComponent } from './form/fields/checkbox/checkbox.component';
import { TextFieldPhoneComponent } from './form/fields/text-field-phone/text-field-phone.component';
import { MultiSelectComponent } from './form/fields/multi-select/multi-select.component';
import { FileComponent } from './form/fields/file/file.component';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';


// export function HttpLoaderFactory(http: HttpClient) {
// 	return new TranslateHttpLoader(http, './assets/languages/', '.json');
// }


registerPlugin(FilePondPluginFileValidateType);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    FormComponent,
    TextFieldComponent,
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
    FileUploadLimitDirective,
    DragComponent,
    CompanyInfoComponent,
    FilterRequestsComponent,
    AdminLayoutComponent,
    ReciptComponent,
    CompaniesComponent,
    InvestmentUsersComponent,
    InvestmentUserViewComponent,
    ComboBoxComponent,
    PredefinedComboBoxComponent,
    CHECKBOXComponent,
    TextFieldPhoneComponent,
    MultiSelectComponent,
    FileComponent,
  ],
  imports: [
    SweetAlert2Module.forRoot(),
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   }
    // }),
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    ToastModule,
    FileUploadModule,
    CommonModule,
    MultiSelectModule,
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
    DialogModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
