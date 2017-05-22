/**
 * Created by P23460 on 22.05.2017.
 */
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HelperService } from '../../services/helpers';

@IonicPage({
  name: "map-view",
})
@Component({
  selector: 'map-view',
  templateUrl: 'map-view.html',
  providers: [ HelperService ],
})
export class MapViewPage {

  map:any;
  impAddr:any;
  taskId : number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public helpers: HelperService) {
    console.log(navParams);
    this.impAddr = navParams.data.address;
    this.taskId = navParams.data.id;
  }
  ngOnInit(){
    this.doRefresh()
  }
  async doRefresh (refresher=null) {
    this.map = {
        defaults: {
          tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
          maxZoom: 18,
          zoomControlPosition: 'bottomleft',
          scrollWheelZoom:'center'
        },
        center: {},
        markers : {},
        events: {
          map: {
            enable: ['context'],
            logic: 'emit'
          }
        }
      }

      if (this.impAddr != null) {
        console.log("Loading Address field: " + this.impAddr)
        this.locateAddr(this.impAddr);
      } else {
        console.log("No Address specified, searching for user location instead")
        //$scope.locateUsr();
      }

    //Stop the ion-refresher from spinning
    if(refresher){
      refresher.complete()
    }
  }

  locateAddr = function(adr){
    this.helpers.ajax({
      url: "//search.mapzen.com/v1/search",
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Token": undefined // Disabling the Token header field, as it is not allowed by Access-Control-Allow-Headers in preflight response.
      },
      params: {
        "text": adr,
        //"boundary.country": "AT", // Search on ly in Austria
        "size": 1,
        "api_key": "mapzen-FZZdZ5c"
      },
    })
      .success(function( data, status ) {
        console.log( "Mapzen request received:", data );

        let rStreet = data.features[0].properties.street || data.features[0].properties.name;
        let rHouse = data.features[0].properties.housenumber || "";
        let rPost = data.features[0].properties.postalcode || "";
        let rCity = data.features[0].properties.locality || data.features[0].properties.county;

        let adrLat = data.features[0].geometry.coordinates[1];
        let adrLng = data.features[0].geometry.coordinates[0];

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

        this.map.center  = {
          lat : adrLat,
          lng : adrLng,
          zoom : 15
        };

        this.map.markers.now = {
          lat: adrLat,
          lng: adrLng,
          message: adr,
          focus: true,
          draggable: false
        };

      })
      .error(function( data, status ) {
        console.log( "Something went wrong!" );
      });
  }
}
