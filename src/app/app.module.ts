import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UtilserviceService } from './services/utilservice.service';
import { NgModel } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    //BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UtilserviceService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NgModel
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
