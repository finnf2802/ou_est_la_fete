import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';

@Component({ 
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public obsable;
  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase
    ) {
      this.obsable = db.list("/items").valueChanges();
      this.obsable.subscribe(console.log);
  }
}