cracApp.controller('MapController',
  [ '$scope',
    '$cordovaGeolocation',
    'LocationsService',
    function(
      $scope,
      $cordovaGeolocation,
      LocationsService
      ) {

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


      $("#map-search-field").val(function(i) {
        return parseFloat(center.lat).toFixed(5) + " | " + parseFloat(center.lng).toFixed(5);
      });

      });







  }]);