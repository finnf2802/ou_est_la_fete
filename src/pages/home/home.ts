import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { Data } from '../../services/data';

@Component({ 
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

 
  public author;
  public msgContent;
  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public data:Data
    ) {
      
  }

  //upload data to Google Firebase on click (btn) via "uploadFirebase()"
  send(){
    if(this.author != null && this.msgContent != null){
      this.data.uploadFirebase(this.author,this.msgContent);
      this.msgContent = "";
    }
      
      
  }
}