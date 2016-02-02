var marker = infowindow = null;

function initialize() {
  var myLatlng = new google.maps.LatLng(48.8592863, 32.1908067);

  var mapOptions = {
    zoom: 4,
    center: myLatlng
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  listener(map);
}

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
      key: 'U0IA3B8A75YJ',
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
      'January', 'February', 'March',
      'April', 'May', 'June',
      'July', 'August', 'September',
      'October', 'November', 'December'
    ];
    
    var date = new Date();
    date.setTime(data.timestamp*1000);

    var month3letters = monthNames[date.getMonth()].slice(0, 3)
      , dayInMonth = date.getDate()
      , year4digits = date.getFullYear()
      , hours = date.getHours()
      , minutes = date.getMinutes()
      , seconds = date.getSeconds();

    var datetimeFormat = 
      month3letters + ' , ' + dayInMonth + ' ' + year4digits + ' ' + 
      hours + ':' + minutes + ':' + seconds;
    /* end: get date */

    infowindow = new google.maps.InfoWindow({
      content: '<div id="content">' +
        '<h1 id="firstHeading" class="firstHeading">' + data.zoneName + '</h1>' +
        '<div id="bodyContent">' +
        '<p>latitude: <b>' + lat + '</b></p>' +
        '<p>longitude: <b>' + lng + '</b></p>' +
        '<p>time: <b>' + datetimeFormat + '</b></p>' +
        '</div>' +
        '</div>'
    });

    infowindow.open(map, marker);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
