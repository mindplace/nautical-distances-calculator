var path;

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

function showNauticalDistance(bothLocations) {
    var lat1 = bothLocations.firstLocation.lat;
    var lng1 = bothLocations.firstLocation.lng;
    var lat2 = bothLocations.secondLocation.lat;
    var lng2 = bothLocations.secondLocation.lng;

    // calculate and show the distance between the two points
    var nauticalDistance = distance(lat1, lng1, lat2, lng2);
    $("#distance").html(Math.round(nauticalDistance * 100) / 100);

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
    var LatLngList = [new google.maps.LatLng (39.85, -98.65), new google.maps.LatLng (39.85, -98.65)];
    var bounds = new google.maps.LatLngBounds();

    // set initial restrictions for Google Maps/Places Autocomplete service
    var options = {
         componentRestrictions: {country: 'us'} //USA only
    };

    // create empty markers to support search result marker placements
    var markerFrom = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    var markerTo = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    var inputFrom = (document.getElementById('pac-input-from'));
    var inputTo = (document.getElementById('pac-input-to'));

    var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom, options);
    var autocompleteTo = new google.maps.places.Autocomplete(inputTo, options);

    var bothLocations = {
        'firstLocation': undefined,
        'secondLocation': undefined
    }

    // create listener for the first location, fires when user finishes typing and presses 'Enter'
    var infowindowFrom = new google.maps.InfoWindow();
    autocompleteFrom.addListener('place_changed', function() {
        infowindowFrom.close();
        markerFrom.setVisible(false);

        var placeFrom = autocompleteFrom.getPlace();
        if (!placeFrom.geometry) {
            window.alert("Please check your input! I couldn't find that place!");
            return;
        } else {
            bothLocations.firstLocation = { lat: placeFrom.geometry.location.lat(), lng: placeFrom.geometry.location.lng() };

            LatLngList[0] = new google.maps.LatLng (placeFrom.geometry.location.lat(), placeFrom.geometry.location.lng());
            for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {
                bounds.extend(LatLngList[i]);
            }
            map.fitBounds(bounds);

            if (bothLocations.firstLocation && bothLocations.secondLocation) {
                showNauticalDistance(bothLocations);
            }
        }

        // Drop marker with nice label
        markerFrom.setPosition(placeFrom.geometry.location);
        markerFrom.setVisible(true);

        var addressFrom = '';
        if (placeFrom.address_components) {
            addressFrom = [
                (placeFrom.address_components[0] && placeFrom.address_components[0].short_name || ''),
                (placeFrom.address_components[1] && placeFrom.address_components[1].short_name || ''),
                (placeFrom.address_components[2] && placeFrom.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindowFrom.setContent('<div><strong>' + placeFrom.name + '</strong><br>' + addressFrom);
        infowindowFrom.open(map, markerFrom);
    });


    // create listener for the second location, fires when user finishes typing and presses 'Enter'
    var infowindowTo = new google.maps.InfoWindow();
    autocompleteTo.addListener('place_changed', function() {
        infowindowTo.close();
        markerTo.setVisible(false);

        var placeTo = autocompleteTo.getPlace();
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
                (placeTo.address_components[0] && placeTo.address_components[0].short_name || ''),
                (placeTo.address_components[1] && placeTo.address_components[1].short_name || ''),
                (placeTo.address_components[2] && placeTo.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindowTo.setContent('<div><strong>' + placeTo.name + '</strong><br>' + addressTo);
        infowindowTo.open(map, markerTo);
    });
}
