import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http'; //REST HTTP

import { BackServiceService } from './servicos/back-service.service';
import { ProcessHTTPMsgService } from './servicos/process-httpmsg.service';
import { baseURL } from './shared/baseurl';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PrincipalComponent } from './principal/principal.component';
import { DetalhesEventoComponent } from './detalhes-evento/detalhes-evento.component';
import { FormEventoComponent } from './form-evento/form-evento.component';
import { LoginComponent } from './login/login.component'; // --> USADO PARA DIALOGO

import { AppRoutingModule } from './routing/app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';  //Usado para formulários Reativos

import { MatDialogModule } from '@angular/material/dialog'; // --> USADO PARA DIALOGO
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input'; //Usado para formulários
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field'; //Usado para formulários
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select'; //Usado no formulário reativo
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; //Usado no formulário reativo

import { FlexLayoutModule } from '@angular/flex-layout';
import { LandingComponent } from './landing/landing.component'; 


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PrincipalComponent,
    DetalhesEventoComponent,
    FormEventoComponent,
    LoginComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatFormFieldModule
  ],
  providers: [
    BackServiceService,
    ProcessHTTPMsgService,
    { provide: 'baseURL', useValue: baseURL }
  ],
  entryComponents: [
    LoginComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
