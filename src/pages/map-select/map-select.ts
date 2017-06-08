import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import Leaflet from 'leaflet';
import 'leaflet-geocoder-mapzen';

import { Geolocation } from '@ionic-native/geolocation';

const mapzenKey = (<any>window).crac_config.mapzenKey

@IonicPage({
  name: "map-select",
})
@Component({
  selector: 'page-map-select',
  templateUrl: 'map-select.html',
  providers: [ Geolocation ],
})
export class MapSelectPage implements OnInit {
  impAddr:any;
  //lat:number;
  //lng:number;
  adrLat = 7;
  adrLng = 7;
  taskId : number;
  map: any;
  geocoder: any;
  result: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public geolocation: Geolocation) {
    console.log(navParams);
    if (navParams.data.address != null) {this.impAddr = navParams.data.address;}
    if (navParams.data.lat != null) {this.adrLat = navParams.data.lat;}
    if (navParams.data.lng != null) {this.adrLng = navParams.data.lng;}
    if (navParams.data.id != null) {this.taskId = navParams.data.id;}
    console.log("Map view for taskId: " + this.taskId);
  }

  ngOnInit(){
    if (this.map != undefined) { this.map.off(); this.map.remove(); }
    this.setupMap();

    this.map.setView(new Leaflet.LatLng(this.adrLat, this.adrLng), 15);

    if (this.impAddr != null) {
      console.log("Loading Address field: " + this.impAddr)
      this.locateAddr(this.impAddr);
    } else {
      console.log("No Address specified, searching for user location instead")
      this.locateUsr();
    }
  }

  setupMap(): void {
    this.map = Leaflet.map('map', {
      zoomControl: false
    });

    Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18,
      scrollWheelZoom:'center',
      doubleClickZoom: 'center',
      touchZoom: 'center'
    }).addTo(this.map);
    Leaflet.control.zoom({ position: "bottomleft" }).addTo(this.map)

    var parameters = {
      "boundary.country": "AT"
    };

    var geocoderOptions = {
      autocomplete: true,
      expanded: true,
      collapsible: false,
      focus: true,
      //fullWidth: true,
      markers: false,
      placeholder: "Ort suchen",
      params: parameters
    };

    this.geocoder = new Leaflet.control.geocoder(mapzenKey, geocoderOptions)
    this.geocoder.addTo(this.map)
    console.log(this)
    if(this.impAddr != null){
      this.geocoder._input.value = this.impAddr
    }
    // Select all Text when clicking/tapping on Input field
    this.geocoder._input.addEventListener("click", function(){
      this.setSelectionRange(0, 9999);
    })

    var once = 1; // TEMP: Leaflet maps fires 2 times on loading... find solution

    this.map.on("moveend", (event) => {
      if (once > 0) { //TEMP
        once -= 1; //TEMP
      } else { //TEMP
        // Get the Leaflet map from the triggered event.
        var map = event.target; // === this.map
        var center = map.getCenter();
        //var curLL = parseFloat(center.lat).toFixed(6) + ", " + parseFloat(center.lng).toFixed(6);
        let curLat = parseFloat(center.lat);
        let curLon = parseFloat(center.lng);

        this.setAddressField(curLat, curLon);
      } //END TEMP ELSE
    });


  }

  mapzenRequest (url, params) : Promise<any> {
    let options = new RequestOptions({
      headers: new Headers({ 'Accept': 'application/json', }),
      params,
    })
    return this.http.get(url, options).toPromise().then(res => res.json())
  }

  /**
   * Put current location into the address field
   */
  async setAddressField (curLat, curLon) {
    let url = "http://search.mapzen.com/v1/reverse"
    let params = {
      "point.lat": curLat,
      "point.lon": curLon,
      //"boundary.country": "AT", // Search on ly in Austria
      "size": 1,
      "api_key": mapzenKey
    }
    let data
    try {
      data = await this.mapzenRequest(url, params)
    } catch(e) {
      console.log( "Something went wrong!" );
      return
    }
    console.log("Mapzen request received:", data);

    var rStreet = data.features[0].properties.street || data.features[0].properties.name;
    var rHouse = data.features[0].properties.housenumber || "";
    var rPost = data.features[0].properties.postalcode || "";
    var rCity = data.features[0].properties.locality || data.features[0].properties.county;

    var Lat = data.features[0].geometry.coordinates[1];
    var Lng = data.features[0].geometry.coordinates[0];

    if (rStreet != "") {
      if (rHouse != "") {
        rStreet += " ";
        rHouse += ", ";
      } else {
        rStreet += ", ";
      }
    }
    if (rPost != "") {
      rPost += " ";
    }

    this.result = rStreet + rHouse + rPost + rCity;
    this.adrLat = Lat;
    this.adrLng = Lng;

    this.geocoder._input.value = this.result
  }

  /**
   * Locate loaded Address
   */
  async locateAddr (adr) {
    let params = {
      "text": adr,
      //"boundary.country": "AT", // Search only in Austria
      "size": 1,
      "api_key": mapzenKey,
    }
    let data
    try {
      data = await this.mapzenRequest("http://search.mapzen.com/v1/search", params)
    } catch(e) {
      console.log( "Something went wrong!" );
      return
    }
    console.log( "Mapzen request received:", data );

    var rStreet = data.features[0].properties.street || data.features[0].properties.name;
    var rHouse = data.features[0].properties.housenumber || "";
    var rPost = data.features[0].properties.postalcode || "";
    var rCity = data.features[0].properties.locality || data.features[0].properties.county;

    var Lat = data.features[0].geometry.coordinates[1];
    var Lng = data.features[0].geometry.coordinates[0];

    if (rStreet != "") {
      if (rHouse != "") {
        rStreet += " ";
        rHouse += ", ";

      } else {
        rStreet += ", ";
      }
    }
    if (rPost != "") {
      rPost += " ";
    }

    this.result = rStreet + rHouse + rPost + rCity;
    this.adrLat = Lat;
    this.adrLng = Lng;

    this.geocoder._input.value = this.result

    this.map.setView(new Leaflet.LatLng(this.adrLat, this.adrLng), 15);

  }

  /**
   * Center map on user's current position
   */
  locateUsr (){
    this.geolocation
      .getCurrentPosition()
      .then( (position) => {
        this.map.setView(new Leaflet.LatLng(position.coords.latitude, position.coords.longitude), 15);

        // this.map.markers.now = {
        //   lat:position.coords.latitude,
        //   lng:position.coords.longitude,
        //   message: "Standort",
        //   focus: true,
        //   draggable: true
        // };

        this.setAddressField(position.coords.latitude, position.coords.longitude);

      }, (err) => {
        // Error
        console.log(err);

        // If user denies access to location services
        // or other error, load map with center on Austria

        this.map.setView(new Leaflet.LatLng(47.67, 13.35), 6);
      });

  }


  save_address(){
    let backView = this.navCtrl.getPrevious()
    backView.instance.navParams.data = {id: this.taskId, address: this.result, lat: this.adrLat, lng: this.adrLng}
    this.navCtrl.pop()
  }

}
