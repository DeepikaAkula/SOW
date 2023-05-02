import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CandidateDetailsComponent } from './candidate-details/candidate-details.component';
import { SOWComponent } from './sow/sow.component';
import { CandidatemappingComponent } from './candidatemapping/candidatemapping.component';
import { CandidateService } from './services/candidate.service';
import { HttpClientModule } from '@angular/common/http';
import { SOWService } from './services/sow.service';
import { CandidatemappingService } from './services/candidatemapping.service';
import { HeaderComponent } from './header/header.component';
import { DomainComponent } from './domain/domain.component';
import { TechnologyComponent } from './technology/technology.component';
import { DomainService } from './services/domain.service';
import { TechnologyService } from './services/technology.service';
import { StatusserviceService } from './services/statusservice.service';
import { LocationserviceService } from './services/locationservice.service';
import { RegionserviceService } from './services/regionservice.service';
import { UsttpmserviceService } from './services/usttpmservice.service';
import { UstpocserviceService } from './services/ustpocservice.service';
import { DellmanagerserviceService } from './services/dellmanagerservice.service';
import { AccountserviceService } from './services/accountservice.service';
import { LoginComponent } from './login/login.component';
import { LoginService } from './services/login.service';
//import { LoggedInAuthGuard } from './auth/loggedInAuthGuard';
import { AuthGuard } from './auth/authGuard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonService } from './common.service';
import { ExcelService } from './services/excel.service';
import { SoListComponent } from './so-list/so-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { CanDeactivateGuardService } from './can-deactivate-guard.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardService } from './services/dashboard.service';
import { RegistrationComponent } from './registration/registration.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ServerdownComponent } from './serverdown/serverdown.component';
import { PaginationcommonComponent } from './paginationcommon/paginationcommon.component';


@NgModule({
  declarations: [
    AppComponent,
    CandidateDetailsComponent,
    SOWComponent,
    HeaderComponent,
    CandidatemappingComponent,
    DomainComponent,
    TechnologyComponent,
    LoginComponent,
    DashboardComponent,
    SoListComponent,
    CandidateListComponent,
    RegistrationComponent,
    ChangePasswordComponent,
    ServerdownComponent,
    PaginationcommonComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [CandidateService, SOWService, CandidatemappingService, DomainService, TechnologyService, StatusserviceService,
    LocationserviceService, RegionserviceService, UsttpmserviceService, UstpocserviceService, DellmanagerserviceService, RegionserviceService,
    AccountserviceService, LoginService, AuthGuard, CommonService, ExcelService, CanDeactivateGuardService, DashboardService],
  bootstrap: [AppComponent]
})

export class AppModule { }
