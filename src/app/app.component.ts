import { Component, ViewChild } from '@angular/core';
import {Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = TabsPage;
  pages: Array<{title: string, component: any}>;
  constructor(public platform: Platform,public statusBar: StatusBar,public splashScreen: SplashScreen) {
    
      this.initializeApp();
    
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.rootPage = TabsPage;    // <<< Set the first page after native side is ready. So, you don't need to write platform.ready() in anypage anymore.

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
