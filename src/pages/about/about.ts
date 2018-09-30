import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import { Geolocation } from "@ionic-native/geolocation";
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from '@ionic-native/google-maps';
import { Data } from '../../services/data';
declare var google;

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  @ViewChild("map") mapElement: ElementRef;
  mapReady: boolean = false;
  map: any;

  private lat;
  private lng;
  private author;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController, 
    public geolocation: Geolocation, 
    public data: Data,
    public navParams: NavParams
  ) { 
    //this.author = navParams.get("author");
    //this.lat = navParams.get("latitude");
    //this.lng = navParams.get("longitude");
  }

  ionViewDidLoad() {
    this.loadMap();
    //this.addAllMarkers();
    //this.addMarker(51.734159299999995,8.733598599999999);
    //this.addMarker(51.734159299999997,8.733598599999997);
    console.log();
  }
  uploadFirebase(lat: number, lng: number) {
    this.data.uploadEvent(lat, lng);
  }
  uploadEventList2(lat: number, lng: number){
    this.data.uploadEventList2(lat, lng);
    this.author = this.data.currentauthor;
  }
  getPosition() {
    const position = this.geolocation.getCurrentPosition();
    position.then(obj => {
      console.log(position);
      this.uploadFirebase(obj.coords.latitude,obj.coords.longitude);
      this.uploadEventList2(obj.coords.latitude, obj.coords.longitude);
    })
      .catch(error => { console.error(error) });
  }

  addAllMarkers(){
    this.data.eventsLi.subscribe((array: any) => {array.forEach(element => {
      console.log(element);
      this.addMarker(element.latitude, element.longitude, element.author);
    });});
    
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addAllMarkers();
    }, (err) => {
      console.log(err);
    });
  }

  addMarker(lat: number, lng: number, author: string) { // To Add Marker
    let latLng = {lat, lng} ;
    console.log(latLng);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });
    console.log(marker);
    let content = "<h3>Event von: </h3>" + "<h1>" + author + "</h1>";
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  onButtonClick() {
    if (!this.mapReady) {
      this.showToast('map is not ready yet. Please try again.');
      return;
    }
    this.map.clear();

    // Get the location of you
    this.map.getMyLocation()
      .then((location: MyLocation) => {
        console.log(JSON.stringify(location, null, 2));

        // Move the map camera to the location with animation
        return this.map.animateCamera({
          target: location.latLng,
          zoom: 17,
          tilt: 30
        }).then(() => {
          // add a marker
          return this.map.addMarker({
            title: '@ionic-native/google-maps plugin!',
            snippet: 'This plugin is awesome!',
            position: location.latLng,
            animation: GoogleMapsAnimation.BOUNCE
          });
        })
      }).then((marker: Marker) => {
        // show the infoWindow
        marker.showInfoWindow();

        // If clicked it, display the alert
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          this.showToast('clicked!');
        });
      });
  }
  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });

    toast.present(toast);
  }
}
