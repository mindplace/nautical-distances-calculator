# Moat Challenge Question 2a: Front-End Web Programming
Challenge: Create a web app that calculates the distance (in nautical miles) between two airports. The app should auto-complete the airports and should feature all airports in the U.S. only. Bonus: plot the trip on Google maps.

## Implementation

#### Libraries and external resources used to build this app
* [Materialize](http://materializecss.com/)
* [Google Maps API](https://developers.google.com/maps/)
* [Google Geocoder API](https://developers.google.com/maps/documentation/geocoding/start)
* [Google Places API](https://developers.google.com/places/)
* [jQuery Autocomplete](https://jqueryui.com/autocomplete/)
* [Airports Open Data](http://ourairports.com/data/)
* [Nautical Distance algorithm](http://www.geodatasource.com/developers/javascript)

<hr>

### This branch
Uses Google Maps/Places for the majority of map, search, and autocomplete functions.

#### Functions:

`placeMarkerFrom()` and `placeMarkerTo()`: initiated by selection made from dropdown autocomplete menu list, or on 'enter' keypress from either input. Closes any previous infoWindows (marker labels) and markers present on the map respective to input (e.g., `placeMarkerFrom()` removes previous `placeFrom` markers and infoWindows), which allows for multiple searches without refreshing the page. Makes a call to Geocoder API to get information about the search term. Pushes result into `bothLocations` object to save latitude and longitude, as well as pushes result into `LatLngList` object. Ensures map view includes marker location, formats marker label, and drops marker on the map. Checks if both points are already on the map and triggers `showNauticalDistance()` if so.

`distance()`: an algorithm developed by [GeoDataSource](http://www.geodatasource.com/developers/javascript), taking two sets of latitude and longitude coordinates and returning nautical distance between them.

`showNauticalDistance()`: takes both search results, triggers `distance()`, appends result to DOM. Uses location coordinates to create new Polyline, append to DOM, and remove any previous Polylines.

`initMap()`: triggered on page load/refresh. Initializes the Google map, creates `LatLngList` array to allow map to stretch to cover both searched points, creates initial markers, listens for keydown on input and triggers `placeMarkerFrom()` and `placeMarkerTo()` if user inputs search query without using autocomplete.

#### Program flow:

1. On page load, `initMap()` is called from the script in `index.html`.
2. On user input, Google Maps/Places triggers to show a drop-down menu of potential matches. User selects from list by clicking or via up/down arrows, or by pressing 'enter' on their own inputted search term, sees a marker drop onto the map to mark their search result.
3. Once user submits both inputs, map boundaries stretch to cover both points. Additionally, `showNauticalDistance()` is triggered, which calls `distance()` with both sets of coordinates to calculate nautical distance, appends result to DOM, and charts the Polyline flight path, deleting any previous Polylines present on the map.
