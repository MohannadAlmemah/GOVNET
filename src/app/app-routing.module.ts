import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FormComponent } from './form/form.component';
import { ServicesComponent } from './services/services.component';
import { EntitiesComponent } from './entities/entities.component';
import { SectionsComponent } from './sections/sections.component';
import { ServciesLayoutComponent } from './layouts/servcies-layout/servcies-layout.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { InvestmentDashboardComponent } from './investement/investment-dashboard/investment-dashboard.component';
import { InvestmentProfileComponent } from './investement/investment-profile/investment-profile.component';
import { LoginInvestmentComponent } from './investement/login-investment/login-investment.component';
import { InvestementSignupComponent } from './investement/investement-signup/investement-signup.component';
import { InvestmentForgetPasswordComponent } from './investement/investment-forget-password/investment-forget-password.component';
import { ConsumerGuard } from 'src/security/consumer.guard';
import { CompanyInfoComponent } from './investement/company-info/company-info.component';
import { FilterRequestsComponent } from './Admin/filter-requests/filter-requests.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ReciptComponent } from './Admin/recipt/recipt.component';
import { InvestmentUsersComponent } from './Admin/investment-users/investment-users.component';
import { CompaniesComponent } from './Admin/companies/companies.component';
import { InvestmentUserViewComponent } from './Admin/investment-user-view/investment-user-view.component';
import { ServiceOutputComponent } from './investement/service-output/service-output.component';
import { AdminGuard } from 'src/security/admin.guard';
import { AuthGuard } from 'src/security/auth.guard';
import { TestComponent } from './test/test.component';
import { JamarekComponent } from './investement/jamarek/jamarek.component';
import { EdtiJamarekComponent } from './investement/edti-jamarek/edti-jamarek.component';

const routes: Routes = [
  { 
    path:'',
    component:DashboardComponent,
    children:[
      {path:'Entites',component:EntitiesComponent},
      { path: '', redirectTo: '/Investment/Dashboard', pathMatch: 'full' }, // Default route (for the base URL)
    ],
  },
  {
    path:'',
    component:ServciesLayoutComponent,
    children:[
      {path:'test',component:TestComponent},
      {path:'Sections',component:SectionsComponent},
      {path:'Services',component:ServicesComponent},
      {path:'Form',component:FormComponent},
      {path:'MyRequests',component:MyRequestsComponent},
    ]
    ,canActivate:[ConsumerGuard],
  },
  {
    path:'Investment',
    component:ServciesLayoutComponent,
    children:[
      {path:'Dashboard',component:InvestmentDashboardComponent},
      {path:'Profile',component:InvestmentProfileComponent},
      {path:'ServiceOutput',component:ServiceOutputComponent},
    ]
    ,canActivate:[ConsumerGuard],
  },
  {
    path:'Investment',
    component:ServciesLayoutComponent,
    children:[
      {path:'Jamarek',component:JamarekComponent},
      {path:'EditJamarek',component:EdtiJamarekComponent},
    ],
  },
  {
    path:'Investment',
    component:ServciesLayoutComponent,
    children:[
      {path:'CompanyInfo',component:CompanyInfoComponent},
    ],
    canActivate:[AuthGuard]
  },
  {
    path:'Investment/Admin',
    component:AdminLayoutComponent,
    children:[
      {path:'FilterRequest',component:FilterRequestsComponent},
      {path:'Recipt',component:ReciptComponent},
      {path:'Users',component:InvestmentUsersComponent},
      {path:'UserView',component:InvestmentUserViewComponent},
      {path:'Companies',component:CompaniesComponent},
    ]
    ,canActivate:[AdminGuard],
  },
  {path:'Investment/login',component:LoginInvestmentComponent},
  {path:'Investment/SignUp',component:InvestementSignupComponent},
  {path:'Investment/ForgetPassword',component:InvestmentForgetPasswordComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
