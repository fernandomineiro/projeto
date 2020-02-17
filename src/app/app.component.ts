import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UtilserviceService } from './services/utilservice.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  load = false;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },    
    {
      title: 'Meus Pedidos',
      url: '/order',
      icon: 'basket'
    }

  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public service: UtilserviceService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  goProile() {
    this.service.navigate(this.service.ROUTES.profile, null)

  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("orderGroupId");
    localStorage.removeItem("associate");
    localStorage.removeItem("sellerID");
    location.reload();
  }
}
