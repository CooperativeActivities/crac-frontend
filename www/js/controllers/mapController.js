cracApp.controller('MapController',
  [ '$scope',
    '$http',
    '$cordovaGeolocation',
    'LocationsService',
    'leafletData',
    function(
      $scope,
      $http,
      $cordovaGeolocation,
      LocationsService,
      leafletData
      ) {

      var map;

      /**
       * Once state loaded, get put map on scope.
       */
      $scope.$on("$stateChangeSuccess", function() {

        $scope.map = {
          defaults: {
            tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            maxZoom: 18,
            zoomControlPosition: 'bottomleft',
            scrollWheelZoom:'center'
          },
          markers : {},
          events: {
            map: {
              enable: ['context'],
              logic: 'emit'
            }
          }
        };

        $scope.locate();

        leafletData.getMap().then(function(map) {

          var parameters = {
            "boundary.country": "AT"
          };
          var geocoderOptions = {
            autocomplete: true,
            expanded: true,
            collapsible: false,
            fullWidth: true,
            markers: false,
            placeholder: "Ort suchen",
            params: parameters
          };

          L.Mapzen.geocoder("mapzen-FZZdZ5c", geocoderOptions).addTo(map);
        });

        // Select all Text when clicking/tapping on Input field
        $(".leaflet-pelias-input").click(function(){
          this.setSelectionRange(0, 9999);
        });

      });

      /**
       * Center map on user's current position
       */
      $scope.locate = function(){

        $scope.map.center  = {
          lat : location.lat,
          lng : location.lng,
          zoom : 12
        };

        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
            $scope.map.center.lat  = position.coords.latitude;
            $scope.map.center.lng = position.coords.longitude;
            $scope.map.center.zoom = 15;

            $scope.map.markers.now = {
              lat:position.coords.latitude,
              lng:position.coords.longitude,
              //message: "Standort",
              focus: true,
              draggable: true
            };

          }, function(err) {
            // Error
            console.log(err);

            // If user denies access to location services
            // or other error, load map with center on Austria

            $scope.map.center  = {
              lat : 47.67,
              lng : 13.35,
              zoom : 6
            };

          });

      };

      $scope.$on('leafletDirectiveMap.move', function(event, args) {
      // Get the Leaflet map from the triggered event.
      var map = args.leafletEvent.target;
      var center = map.getCenter();

      // Update the marker.
        $scope.map.markers = {
          marker: {
            lat: center.lat,
            lng: center.lng,
          }
        };

      });

      $scope.$on('leafletDirectiveMap.moveend', function(event, args) {
        // Get the Leaflet map from the triggered event.
        var map = args.leafletEvent.target;
        var center = map.getCenter();
        //var curLL = parseFloat(center.lat).toFixed(6) + ", " + parseFloat(center.lng).toFixed(6);
        curLat = parseFloat(center.lat);
        curLon = parseFloat(center.lng);

        $http({
          url: "//search.mapzen.com/v1/reverse",
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Token": undefined // Disabling the Token header field, as it is not allowed by Access-Control-Allow-Headers in preflight response.
          },
          params: {
            "point.lat": curLat,
            "point.lon": curLon,
            "boundary.country": "AT",
            "size": 1,
            "api_key": "mapzen-FZZdZ5c"
          },
        })
        .success(function( data, status ) {
          console.log( "Request received:", data );

          var rStreet = data.features[0].properties.street || data.features[0].properties.name;
          var rHouse = data.features[0].properties.housenumber || "";
          var rPost = data.features[0].properties.postalcode || "";
          var rCity = data.features[0].properties.locality || data.features[0].properties.county;

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

          var result = rStreet + rHouse + rPost + rCity;

          $(".leaflet-pelias-input").val(result);

        })
        .error(function( data, status ) {
          console.log( "Something went wrong!" );
        });
      });

      $scope.save_address = function(){
        //TODO: Save Address
        alert("TODO: Save Address");
      }
      
  }]);