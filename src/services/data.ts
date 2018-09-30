import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from "rxjs/Observable";

@Injectable()
export class Data{
    public messages;
    public eventsLi: Observable<any>;
  public currentauthor;
  public counter=0 ;
 
  constructor(public db: AngularFireDatabase)
  {
    this.downloadFirebase();
    this.downloadFirebaseList2();
}

//download data from Google Firebase cloud
downloadFirebase(){
  this.messages = this.db.list("/items").valueChanges().map(items => items.sort((a:any, b:any) => a.timestamp - b.timestamp));
  this.messages.subscribe(console.log);
}


downloadFirebaseList2(){
  this.eventsLi = this.db.list("/events").valueChanges();
  this.eventsLi.subscribe(console.log);
}

uploadEventList2(lat: number, lng: number){
  const items = this.db.list("/events");
  if(this.currentauthor != null){
    items.push({author: this.currentauthor, timestamp: Date.now(), latitude:lat, longitude:lng});
  }
}

uploadEvent(lat:number,lng:number)
{
  const items = this.db.list("/items");
  if(this.currentauthor != null){
    items.push({author: this.currentauthor, content:"Event",timestamp: Date.now(),latitude:lat,longitude:lng});
    
  }
}
uploadFirebase(author:String,msgContent:String){
    const items = this.db.list("/items");

    if(author == "a1")
      this.currentauthor = "Hugo";
    else if(author == "a2")
      this.currentauthor = "Martin";
    else if(author == "a3")
      this.currentauthor = "Admin";

    if(this.currentauthor != null){
      items.push({author: this.currentauthor, content:msgContent,timestamp: Date.now()});
      
    }
  }
}