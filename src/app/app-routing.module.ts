import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/authGuard';
import { CanDeactivateGuardService } from './can-deactivate-guard.service';
import { CandidateDetailsComponent } from './candidate-details/candidate-details.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { CandidatemappingComponent } from './candidatemapping/candidatemapping.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DomainComponent } from './domain/domain.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { SoListComponent } from './so-list/so-list.component';
import { SOWComponent } from './sow/sow.component';
import { TechnologyComponent } from './technology/technology.component';

const routes: Routes = [
  {path:'',redirectTo:'/login',pathMatch:'full'},
  {path:'candidatedetails',component:CandidateDetailsComponent,canActivate:[AuthGuard]},
  {path:'sow',component:SOWComponent,canActivate:[AuthGuard]},
  {path:'mapping',component:CandidatemappingComponent,canActivate:[AuthGuard]},
  {path:'domain',component:DomainComponent,canActivate:[AuthGuard]},
  {path:'technology',component:TechnologyComponent,canActivate:[AuthGuard]},
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent,canActivate:[AuthGuard]},
  {path:'soList',component:SoListComponent,canDeactivate:[CanDeactivateGuardService]},
  {path:'candidateList',component:CandidateListComponent,canDeactivate:[CanDeactivateGuardService]},
  {path:'registration',component:RegistrationComponent,canActivate:[AuthGuard]},
  {path:'changePw',component:ChangePasswordComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
