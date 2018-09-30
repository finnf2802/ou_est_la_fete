import { Component } from '@angular/core';
import { NavController, Tabs } from 'ionic-angular';


import { AngularFireDatabase } from 'angularfire2/database';
import { Data } from '../../services/data';
import { ContactPage } from '../contact/contact';


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
  
  showMarkerMap(lat: number, lng: number, author: string){
    this.navCtrl.push(ContactPage, {
      latitude: lat,
      longitude: lng,
      author: author
    })
  }

  //upload data to Google Firebase on click (btn) via "uploadFirebase()"
  send(){
    if(this.author != null && this.msgContent != null){
      this.data.uploadFirebase(this.author,this.msgContent);
      this.msgContent = null;
    }
      
      
  }
}