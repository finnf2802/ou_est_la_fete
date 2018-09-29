import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";

@Injectable()
export class Data{
    public messages;
  public currentauthor;
  public counter=0 ;
 
  constructor(public db: AngularFireDatabase)
  {
    this.downloadFirebase();
}

//download data from Google Firebase cloud
downloadFirebase(){
    this.messages = this.db.list("/items").valueChanges().map(items => items.sort((a:any, b:any) => a.timestamp - b.timestamp));
    this.messages.subscribe(console.log);
    
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