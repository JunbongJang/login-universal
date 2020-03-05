import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {ServerService} from './server/server.service';
import {AppRoutingModule} from './app-routing.module';
import { reducers } from './store/reducers/app.reducers';
import {StoreModule} from '@ngrx/store';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ServerInterceptor} from './server/server.interceptor';

import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { RegisterComponent } from './signup/register/register.component';
import { AgreeComponent } from './signup/agree/agree.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SignupHeaderComponent } from './signup/signup-header/signup-header.component';
import { SignupComponent } from './signup/signup.component';
import { FindidComponent } from './finduser/findid/findid.component';
import { FinduserComponent } from './finduser/finduser.component';
import { FindpassComponent } from './finduser/findpass/findpass.component';
import { FindResultComponent } from './finduser/find-result/find-result.component';

import * as bootstrap from 'bootstrap';
declare var jQuery: any;

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    AgreeComponent,
    HeaderComponent,
    LoginComponent,
    FooterComponent,
    SignupHeaderComponent,
    SignupComponent,
    FindidComponent,
    FinduserComponent,
    FindpassComponent,
    FindResultComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers)
  ],
  providers: [ServerService,
    {provide: HTTP_INTERCEPTORS, useClass: ServerInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
