angular.module('app', [])
  .controller('MapController', function MapController($scope) {
    $scope.head = {
      index: `#`,
      dataZoneName: `Zone name`,
      lat: `Latitude`,
      lng: `Longitude`,
      datetimeFormat: `Time`,
      remove: `Remove`
    }
    $scope.sort = {
      predicate: `index`,
      reverse:   false
    };
    $scope.columnSort = function (predicate) {
      if(predicate != `remove`) {
        $scope.sort.reverse   = !$scope.sort.reverse;
        $scope.sort.predicate = predicate;
      }
    }

    $scope.pointsStore = [];
    $scope.updatePointsStore = function (pointsStore) {
      pointsStore['index'] = Object.keys($scope.pointsStore).length ? $scope.pointsStore[Object.keys($scope.pointsStore).length - 1]['index'] + 1 : 0;
      $scope.pointsStore.push(pointsStore);
    };
    $scope.remove = function (item) {
      var ttt = $scope.pointsStore.filter(function(obj) {
        return obj.index !== item;
      });
      $scope.pointsStore = ttt;
    };
  })

  .directive('googleMap', function() {
    var link = function(scope, element, attrs) {
      var map        = null
        , infowindow = null
        , marker     = null;

      var mapOptions = {
        center:    new google.maps.LatLng(48.8592863, 32.1908067),
        zoom:      4
      };

      function initMap() {
        if (map == null) {
          map = new google.maps.Map(element[0], mapOptions);

          listener(map);
        }
      }

      initMap();

      function listener(map) {
        google.maps.event.addListener(map, 'click', function(event) {
          (marker != null) && marker.setMap(null);
          (infowindow != null) && marker.setMap(null);

          var lat = event.latLng.lat();
          var lng = event.latLng.lng();

          displayZone(lat, lng, map);
        });
      }

      function displayZone(lat, lng, map) {
        var tz = new TimeZoneDB;
        tz.getJSON({
            key: `U0IA3B8A75YJ`,
            lat: lat,
            lng: lng
        }, function(data) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map,
            title: data.zoneName
          });

          /* start: get date */
          var monthNames = [
            `January`, `February`, `March`,
            `April`, `May`, `June`,
            `July`, `August`, `September`,
            `October`, `November`, `December`
          ];
          
          var date = new Date();
          date.setTime(data.timestamp*1000);

          var month3letters = monthNames[date.getMonth()].slice(0, 3)
            , dayInMonth = date.getDate()
            , year4digits = date.getFullYear()
            , hours = date.getHours()
            , minutes = date.getMinutes()
            , seconds = date.getSeconds();

          var datetimeFormat = `${month3letters}, ${dayInMonth} ${year4digits} ${hours}:${minutes}:${seconds}`;
          /* end: get date */

          infowindow = new google.maps.InfoWindow({
            content: `<div id="content">
              <h1 id="firstHeading" class="firstHeading">${data.zoneName}</h1>
              <div id="bodyContent">
              <p>latitude: <b>${lat}</b></p>
              <p>longitude: <b>${lng}</b></p>
              <p>time: <b>${datetimeFormat}</b></p>
              </div>
              </div>`
          });

          var pointsStore = {
            dataZoneName: data.zoneName,
            lat: lat,
            lng: lng,
            datetimeFormat: datetimeFormat
          };
          scope.$apply(function() {
            scope.updatePointsStore(pointsStore);
          });

          infowindow.open(map, marker);
        });
      }
    };

    return {
      controller: `MapController`,
      template: `<div id="map-canvas"></div>`,
      link: link
    };
  });
