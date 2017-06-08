import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HelperService } from '../../services/helpers';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as Leaflet from 'leaflet';

const mapzenKey = (<any>window).crac_config.mapzenKey

@IonicPage({
  name: "map-view",
})
@Component({
  selector: 'map-view',
  templateUrl: 'map-view.html',
  providers: [ HelperService ],
})
export class MapViewPage implements OnInit {

  //map:any;
  impAddr:any;
  lat:number;
  lng:number;
  taskId : number;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public helpers: HelperService, public http: Http) {
    console.log(navParams);
    this.impAddr = navParams.data.address;
    this.lat = navParams.data.lat;
    this.lng = navParams.data.lng;
    this.taskId = navParams.data.id;
  }
  ngOnInit(){
    if (this.map != undefined) { this.map.off(); this.map.remove(); }
    this.drawMap();
    this.doRefresh()
  }
  drawMap(): void {
    this.map = Leaflet.map('map');

    // map = {
    //   defaults: {
    //     tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    //     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    //     maxZoom: 18,
    //     zoomControlPosition: 'bottomleft',
    //     scrollWheelZoom:'center'
    //   },
    //   center: {},
    //   markers : {},
    //   events: {
    //     map: {
    //       enable: ['context'],
    //       logic: 'emit'
    //     }
    //   }
    // }
    Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18,
      zoomControlPosition: 'topleft',
      scrollWheelZoom:'center'
    }).addTo(this.map);

    this.map.setView(new Leaflet.LatLng(this.lat, this.lng), 15);
    // map.center  = {
    //   lat : this.lat,
    //   lng : this.lng,
    //   zoom : 15
    // };
    // var markerIcon = Leaflet.icon({
    //     iconUrl: 'assets/images/marker-icon.png',
    //     shadowUrl: 'assets/images/marker-shadow.png',

    //     // iconSize:     [38, 95], // size of the icon
    //     // shadowSize:   [50, 64], // size of the shadow
    //     iconAnchor:      [0, 0], // point of the icon which will correspond to marker's location
    //     // shadowAnchor: [4, 62],  // the same for the shadow
    //     // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    // });

    // Leaflet.marker([this.lat, this.lng], {icon: markerIcon})
    //   .addTo(this.map)
    //   .bindPopup(this.impAddr)
    //   .openPopup();


    // if (this.impAddr != null) {
    //   console.log("Loading Address field: " + this.impAddr + " | lat: " + this.lat + ", lng: " + this.lng)
    //   this.locateAddr(this.impAddr);
    // } else {
    //   console.log("No Address specified, searching for user location instead")
    //   //$scope.locateUsr();
    // }

    if (this.lat != 0 && this.lng != 0 &&
      // many tasks have lat: 0, lng: 0 which can't be right
      // -md, 2017-05-24
      !(this.lat === 0 && this.lng === 0)) {
      console.log("Loading Address coordinates: lat: " + this.lat + ", lng: " + this.lng)
      this.locateCoord();
    } else {
      console.log("No Coordinates specified, searching for stored address string instead")

      if (this.impAddr != null) {
        console.log("Loading Address field: " + this.impAddr)
        this.locateAddr(this.impAddr);
      } else {
        console.log("No Address specified, searching for user location instead")
        //$scope.locateUsr();
      }
    }
  }
  async doRefresh (refresher=null) {
    // let map = Leaflet.map('map');
    // Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    //   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    //   maxZoom: 18,
    //   zoomControlPosition: 'bottomleft',
    //   scrollWheelZoom:'center'
    // }).addTo(map);

    // this.map = {
    //     defaults: {
    //       tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    //       maxZoom: 18,
    //       zoomControlPosition: 'bottomleft',
    //       scrollWheelZoom:'center'
    //     },
    //     center: {},
    //     markers : {},
    //     events: {
    //       map: {
    //         enable: ['context'],
    //         logic: 'emit'
    //       }
    //     }
    //   }



    //Stop the ion-refresher from spinning
    if(refresher){
      refresher.complete()
    }
  }
  locateCoord = function(){
    this.map.setView(new Leaflet.LatLng(this.lat, this.lng), 15);
    // this.map.center  = {
    //   lat : this.lat,
    //   lng : this.lng,
    //   zoom : 15
    // };
    this.drawMarker();
  }

  async locateAddr (adr) {
    let params = {
      "text": adr,
      //"boundary.country": "AT", // Search only in Austria
      "size": 1,
      "api_key": mapzenKey,
    }
    let options = new RequestOptions({
      headers: new Headers({
        'Accept': 'application/json',
      }),
      params,
    })
    let data
    try {
      data = await this.http.get("http://search.mapzen.com/v1/search", options)
        .toPromise()
        .then(res => res.json())
    } catch(e) {
      console.log( "Something went wrong!" );
      return
    }

    console.log( "Mapzen request received:", data);

    //let rStreet = data.features[0].properties.street || data.features[0].properties.name;
    //let rHouse = data.features[0].properties.housenumber || "";
    //let rPost = data.features[0].properties.postalcode || "";
    //let rCity = data.features[0].properties.locality || data.features[0].properties.county;

    let adrLat = data.features[0].geometry.coordinates[1];
    let adrLng = data.features[0].geometry.coordinates[0];

    this.lat = adrLat;
    this.lng = adrLng;

    this.map.setView(new Leaflet.LatLng(this.lat, this.lng), 15);

    // if (rStreet != "") {
    //   if (rHouse != "") {
    //     rStreet += " ";
    //     rHouse += ", ";
    //   } else {
    //     rStreet += ", ";
    //   }
    // }
    // if (rPost != "") {
    //   rPost += " ";
    // }

    // this.map.center  = {
    //   lat : adrLat,
    //   lng : adrLng,
    //   zoom : 15
    // };

    // this.map.markers.now = {
    //   lat: adrLat,
    //   lng: adrLng,
    //   message: adr,
    //   focus: true,
    //   draggable: false
    // };

    this.drawMarker();
  }
  locateUsr (){
    // //web location
    // map.locate({ setView: true});

    // //when we have a location draw a marker and accuracy circle
    // function onLocationFound(e) {
    //   var radius = e.accuracy / 2;

    //   Leaflet.marker(e.latlng).addTo(map);
    //      // .bindPopup("You are within " + radius + " meters from this point").openPopup();

    //   Leaflet.circle(e.latlng, radius).addTo(map);
    // }
    // map.on('locationfound', onLocationFound);
    // //alert on location error
    // function onLocationError(e) {
    //   alert(e.message);
    // }

    // map.on('locationerror', onLocationError);
  }
  drawMarker (){
    var markerIcon = Leaflet.icon({
        iconUrl: 'assets/images/marker-icon.png',
        shadowUrl: 'assets/images/marker-shadow.png',

        // iconSize:     [38, 95], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        iconAnchor:      [12.5, 41], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [0, -35] // point from which the popup should open relative to the iconAnchor
    });

    Leaflet.marker([this.lat, this.lng], {icon: markerIcon})
      .addTo(this.map)
      .bindPopup(this.impAddr)
      .openPopup();
  }
}
