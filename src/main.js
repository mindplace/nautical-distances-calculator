var path;

function placeMarkerFrom() {
    infowindowFrom.close(); // close any previous markerFrom infowindow
    markerFrom.setVisible(false); // make any previous markerFrom invisible

    // setup geocoder to find marker location by text address supplied by autocomplete
    var geocoder = new google.maps.Geocoder();
    var address = inputFrom.value;

    // make call to Geocoder API with the address
    geocoder.geocode( { 'address': address}, function(placeFrom, status) {
      placeFrom = placeFrom[0];

      if (!placeFrom.geometry) {
          window.alert("Please check your input! I couldn't find that place!");
          return; // just in case Geocoder didn't find the address... it's a possibility, even with prepopulated list
      } else {
          bothLocations.firstLocation = { lat: placeFrom.geometry.location.lat(), lng: placeFrom.geometry.location.lng() };

          // LatLngList keeps track of the two points which the map must make visible at the same time
          LatLngList[0] = new google.maps.LatLng (placeFrom.geometry.location.lat(), placeFrom.geometry.location.lng());
          for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {
              bounds.extend(LatLngList[i]);
          }
          // here it fits the two current points, one of which is the new point being placed on the map
          map.fitBounds(bounds);

          // if both the first and second locations are defined, do the nautical distance calculations and show result
          if (bothLocations.firstLocation && bothLocations.secondLocation) {
              showNauticalDistance(bothLocations);
          }
      }

      // Drop marker with nice formatted label
      markerFrom.setPosition(placeFrom.geometry.location);
      markerFrom.setVisible(true);

      var addressFrom = '';
      if (placeFrom.address_components) {
          addressFrom = [
              ((placeFrom.address_components[1] && placeFrom.address_components[1].long_name) + "," || ''),
              (placeFrom.address_components[2] && placeFrom.address_components[2].short_name || '')
          ].join(' ');
      }

      infowindowFrom.setContent('<div><strong>' + placeFrom.address_components[0].short_name + '</strong><br>' + addressFrom);
      infowindowFrom.open(map, markerFrom);
    });
};

function placeMarkerTo() {
    infowindowTo.close();
    markerTo.setVisible(false);

    var geocoder = new google.maps.Geocoder();
    var address = inputTo.value;

    geocoder.geocode( { 'address': address}, function(placeTo, status) {
      placeTo = placeTo[0];

      if (!placeTo.geometry) {
          window.alert("Please check your input! I couldn't find that place!");
          return;
      } else {
          bothLocations.secondLocation = { lat: placeTo.geometry.location.lat(), lng: placeTo.geometry.location.lng() };

          LatLngList[1] = new google.maps.LatLng (placeTo.geometry.location.lat(), placeTo.geometry.location.lng());
          for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {
              bounds.extend(LatLngList[i]);
          }
          map.fitBounds(bounds);

          if (bothLocations.firstLocation && bothLocations.secondLocation) {
              showNauticalDistance(bothLocations);
          }
      }

      markerTo.setPosition(placeTo.geometry.location);
      markerTo.setVisible(true);

      var addressTo = '';
      if (placeTo.address_components) {
        addressTo = [
          ((placeTo.address_components[1] && placeTo.address_components[1].long_name) + "," || ''),
          (placeTo.address_components[2] && placeTo.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindowTo.setContent('<div><strong>' + placeTo.address_components[0].short_name + '</strong><br>' + addressTo);
      infowindowTo.open(map, markerTo);
    });
};

$(document).ready(function() {
  // use jQuery to do autocomplete from the airportEntries values in 'usa-airports.js' file

  //    I much prefer my previous method of using Google Maps+Places Autocomplete because it
  // delivers a much more professional-feeling experience, both from user and developer side;
  // however Autocomplete and AutocompleteService wasn't able to show only airports.

  //   If you'd like to see the other method: git checkout working-solution-all-places

   $("#pac-input-from").autocomplete({
      source: airportEntries,
      select: function(e, ui) {
        inputFrom.value = ui.item.value;
        placeMarkerFrom();
      }
   });

   $("#pac-input-to").autocomplete({
      source: airportEntries,
      select: function(e, ui) {
        inputTo.value = ui.item.value;
        placeMarkerTo();
      }
   });
});

// GeoDataSource algorithm for determining nautical distance: http://www.geodatasource.com/developers/javascript
function distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var radlon1 = Math.PI * lon1/180;
    var radlon2 = Math.PI * lon2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    // here, dist is turned into nautical miles
    dist = dist * 0.8684;
    return dist;
}

// once both points are available, showNauticalDistance calls distance() and appends nautical distance result to the DOM,
// as well as build the Polyline between the new points.
function showNauticalDistance(bothLocations) {
    var lat1 = bothLocations.firstLocation.lat;
    var lng1 = bothLocations.firstLocation.lng;
    var lat2 = bothLocations.secondLocation.lat;
    var lng2 = bothLocations.secondLocation.lng;

    // calculate and show the distance between the two points
    var nauticalDistance = distance(lat1, lng1, lat2, lng2);
    $("#distance").html(Math.round(nauticalDistance * 100) / 100);

    // needed for the Polyline
    var flightPlanCoordinates = [
        {lat: lat1, lng: lng1},
        {lat: lat2, lng: lng2},
    ];

    flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    if (path) {
        // if there's already a path charted on the map, clear it
        path.setMap(null);
    }

    // show the new flight path on the map
    path = flightPath;
    path.setMap(map);
};

// initMap gets triggered by the script on the index page on load/refresh
function initMap() {
    // create a new map instance on load and set it to center of USA, zoomed out to include whole country
    map = new google.maps.Map(document.getElementById('map'));
    map.setCenter(new google.maps.LatLng(39.850033, -98.6500523));
    map.setZoom(4);

    // create latitude and longitude array and set map to be big enough to include those points.
    // initially array has two identical points of center of USA to ensure the pretty map view while empty
    LatLngList = [new google.maps.LatLng (39.85, -98.65), new google.maps.LatLng (39.85, -98.65)];
    bounds = new google.maps.LatLngBounds();

    // create empty markers to support search result marker placements
    markerFrom = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    markerTo = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    inputFrom = (document.getElementById('pac-input-from'));
    inputTo = (document.getElementById('pac-input-to'));

    // use bothLocations object to keep track of doing/showing nautical distance calculations
    bothLocations = {
        'firstLocation': undefined,
        'secondLocation': undefined
    }

    // create listener for the first location, fires when user finishes typing and presses 'Enter'
    infowindowFrom = new google.maps.InfoWindow();
    $("#pac-input-from").keydown(function(e) {
        // wait until user presses enter on their search query
        if(e.which == 13) {
            placeMarkerFrom();
        }
    });

    // create listener for the second location, fires when user finishes typing and presses 'Enter'
    infowindowTo = new google.maps.InfoWindow();
    $("#pac-input-to").keydown(function(e) {
        // wait until user presses enter on their search query
        if(e.which == 13) {
            placeMarkerTo();
        }
    });
}
