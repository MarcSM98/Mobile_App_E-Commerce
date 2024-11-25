import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  currentUser;

  constructor(private fsService: FirestoreService, private menuController: MenuController, private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private authService: AuthService) {
    this.initializeApp();

    this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    this.authService.logout();
  }

  close() {
    this.menuController.close("main-menu");
  }


}
