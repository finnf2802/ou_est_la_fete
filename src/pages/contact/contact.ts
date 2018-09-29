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
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  @ViewChild("map_event") mapElement: ElementRef;
  mapReady: boolean = false;
  map: any;

private lat;
private lng;
private author;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController, public geolocation: Geolocation, public data: Data, public navParams: NavParams
  ) {
    this.lat = navParams.get("latitude");
   this.lng = navParams.get("longitude");
   this.author = navParams.get("author");
 
   }

  ionViewDidLoad() {
    this.loadMap();
    this.addMarker(this.lat, this.lng)
  }

  loadMap() {
      let latLng = new google.maps.LatLng(this.lat, this.lng);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    
  }

  addMarker(lat: number, lng: number) { // To Add Marker
    let latLng = {lat, lng} ;
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });
    let content = "<h3>Event von: </h3>" + "<h1>" + this.author + "</h1>";
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
