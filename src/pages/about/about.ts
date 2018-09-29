import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController, public geolocation: Geolocation, public data: Data
  ) { }

  ionViewDidLoad() {
    this.loadMap();
  }
  uploadFirebase(lat: number, lng: number) {
    this.data.uploadEvent(lat,lng  );
  }
  getPosition() {
    const position = this.geolocation.getCurrentPosition();
    position.then(obj => {
      console.log(position);
      this.uploadFirebase(obj.coords.latitude,obj.coords.longitude);
    })
      .catch(error => { console.error(error) });

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
    }, (err) => {
      console.log(err);
    });
  }

  addMarker(lat: number, lng: number) { // To Add Marker
    let latLng = {lat, lng} ;
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });
    let content = "<h3>My New Location!</h3>";
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
