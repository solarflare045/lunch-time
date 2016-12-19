import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { HomePage } from './home';

@Component({
  templateUrl: 'home-options.html'
})
export class HomeOptionsPage {
  private homePage: HomePage;

  constructor(private viewCtrl: ViewController) {
    this.homePage = this.viewCtrl.data;
  }

  restart() {
    this.close();
    this.homePage.restart();
  }

  players() {
    this.close();
    this.homePage.changePlayers();
  }

  close() {
    this.viewCtrl.dismiss();
  }

  saveQuantum(event: boolean) {
    this.homePage.saveQuantum(event);
  }
}
