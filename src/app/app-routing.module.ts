import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FormComponent } from './form/form.component';
import { Form2Component } from './form2/form2.component';
const routes: Routes = [
  { 
    path:'',
    component:DashboardComponent,
    children:[
      {path:'home',component:HomeComponent},
      {path:'Form',component:FormComponent},
      {path:'Form2',component:Form2Component},

    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
