/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule} from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';

import { HttpService } from './shared/http.service';
import { AuthService } from './auth/auth.service';
import { HomeService } from './home/home.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
  import {BuffertimeComponent} from './home/homecomponents/buffertime/buffertime.component';
  import {BusinesshoursComponent} from './home/homecomponents/businesshours/businesshours.component';
  import {ClipboardcopyComponent} from './home/homecomponents/clipboardcopy/clipboardcopy.component';
  import {DaterangeComponent} from './home/homecomponents/daterange/daterange.component';
  import {MeetingdurationComponent} from './home/homecomponents/meetingduration/meetingduration.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    BuffertimeComponent,
    BusinesshoursComponent,
    ClipboardcopyComponent,
    DaterangeComponent,
    MeetingdurationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  exports:[
    MaterialModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    HttpService,
    AuthService,
    HomeService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
