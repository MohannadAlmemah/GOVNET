import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FormComponent } from './form/form.component';
import { ServicesComponent } from './services/services.component';
import { EntitiesComponent } from './entities/entities.component';
import { SectionsComponent } from './sections/sections.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { LoginComponent } from './login/login.component';
import { TestComponent } from './test/test.component';
import { ServciesLayoutComponent } from './layouts/servcies-layout/servcies-layout.component';

const routes: Routes = [
  { 
    path:'',
    component:DashboardComponent,
    children:[
      {path:'home',component:HomeComponent},
      {path:'Entites',component:EntitiesComponent},
      {path:'login',component:LoginComponent},

    ],
  },
  {
    path:'',
    component:ServciesLayoutComponent,
    children:[
      {path:'Test',component:TestComponent},
      {path:'Sections',component:SectionsComponent},
      {path:'Services',component:ServicesComponent},
      {path:'Form',component:FormComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
