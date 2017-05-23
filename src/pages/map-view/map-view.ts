/**
 * Created by P23460 on 22.05.2017.
 */
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HelperService } from '../../services/helpers';

import { Http, Headers } from '@angular/http';
import * as Leaflet from 'leaflet';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public helpers: HelperService, public http: Http) {
    console.log(navParams);
    this.impAddr = navParams.data.address;
    this.lat = navParams.data.lat;
    this.lng = navParams.data.lng;
    this.taskId = navParams.data.id;
  }
  ngOnInit(){
    this.drawMap();
    this.doRefresh()
  }
  drawMap(): void {
    let map = Leaflet.map('map');
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
    }).addTo(map);

    map.setView(new Leaflet.LatLng(this.lat, this.lng), 15);
    // map.center  = {
    //   lat : this.lat,
    //   lng : this.lng,
    //   zoom : 15
    // };
    Leaflet.marker([this.lat, this.lng]).addTo(map)
      .bindPopup(this.impAddr).openPopup();


    // if (this.impAddr != null) {
    //   console.log("Loading Address field: " + this.impAddr + " | lat: " + this.lat + ", lng: " + this.lng)
    //   this.locateAddr(this.impAddr);
    // } else {
    //   console.log("No Address specified, searching for user location instead")
    //   //$scope.locateUsr();
    // }

    if (this.lat != null && this.lng != null) {
      console.log("Loading Address coordinates: lat: " + this.lat + ", lng: " + this.lng)
      this.locateCoord();
    } else {
      console.log("No Coordinates specified, searching for stored address string instead")
      //$scope.locateUsr();
      if (this.impAddr != null) {
        console.log("Loading Address field: " + this.impAddr)
        //this.locateAddr(this.impAddr);
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
    // this.map.center  = {
    //   lat : this.lat,
    //   lng : this.lng,
    //   zoom : 15
    // };
  }

  locateAddr = function(adr){
    // let headers = new Headers({'Accept': 'application/json'});
    // let options = new RequestOptions({ headers: headers});
    // //this.headers.append('Token', undefined);
    // return this.http.get("//search.mapzen.com/v1/search", body, options)
    //   .subscribe((res) => { this.data = res.json();} );

      //  Old version:
    //     "Accept": "application/json",
    //     "Token": undefined // Disabling the Token header field, as it is not allowed by Access-Control-Allow-Headers in preflight response.
    //   },
    //   params: {
    //     "text": adr,
    //     //"boundary.country": "AT", // Search on ly in Austria
    //     "size": 1,
    //     "api_key": "mapzen-FZZdZ5c"
    //   },
    //}
    //   .success(function( data, status ) {
    //     console.log( "Mapzen request received:", data );

    //     let rStreet = data.features[0].properties.street || data.features[0].properties.name;
    //     let rHouse = data.features[0].properties.housenumber || "";
    //     let rPost = data.features[0].properties.postalcode || "";
    //     let rCity = data.features[0].properties.locality || data.features[0].properties.county;

    //     let adrLat = data.features[0].geometry.coordinates[1];
    //     let adrLng = data.features[0].geometry.coordinates[0];

    //     if (rStreet != "") {
    //       if (rHouse != "") {
    //         rStreet += " ";
    //         rHouse += ", ";
    //       } else {
    //         rStreet += ", ";
    //       }
    //     }
    //     if (rPost != "") {
    //       rPost += " ";
    //     }

    //     this.map.center  = {
    //       lat : adrLat,
    //       lng : adrLng,
    //       zoom : 15
    //     };

    //     this.map.markers.now = {
    //       lat: adrLat,
    //       lng: adrLng,
    //       message: adr,
    //       focus: true,
    //       draggable: false
    //     };

    //   })
    //   .error(function( data, status ) {
    //     console.log( "Something went wrong!" );
    //   });
  }
  locateUsr = function(){
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
}
