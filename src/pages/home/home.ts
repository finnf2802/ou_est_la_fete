import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';

@Component({ 
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public obsable;
  private author1;
  
  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase
    ) {
      this.downloadFirebase();
  }

  //download data from Google Firebase cloud
  downloadFirebase(){
    this.obsable = this.db.list("/items").valueChanges();
    this.obsable.subscribe(console.log);
  }

  //upload data to Google Firebase cloud
  uploadFirebase(){
    const items = this.db.list("/items");

    if(this.author == "a1")
      this.author1 = "author1";
    else if(this.author == "a2")
      this.author1 = "author2";

    if(this.author1 != null)
      items.push({author: this.author1, content: this.msgContent})
  }

  //upload data to Google Firebase on click (btn) via "uploadFirebase()"
  send(){
    if(this.author != null && this.msgContent != null)
      this.uploadFirebase();
  }
}