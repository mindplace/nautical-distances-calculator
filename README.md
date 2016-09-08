# Moat Challenge Question 2a: Front-End Web Programming
Challenge: Create a web app that calculates the distance (in nautical miles) between two airports. The app should auto-complete the airports and should feature all airports in the U.S. only. Bonus: plot the trip on Google maps.

## Implementation
Please note that documentation contained in this README is primarily meant to supplement the comments in the code.

#### Libraries and external resources I used in this app
[Materialize](http://materializecss.com/): apart from being beautiful and clean, I used Materialize because I wanted all the Google elements to feel natural on the same page. 
[Google Maps API](https://developers.google.com/maps/)
[Google Geocoder Api](https://developers.google.com/maps/documentation/geocoding/start)
[jQuery Autocomplete](https://jqueryui.com/autocomplete/)
[Airports Open Data](http://ourairports.com/data/)
[Nautical Distance algorithm](http://www.geodatasource.com/developers/javascript)

### Version 1 - compliant with entirety of challenge
To view: code is on the `master` git branch.

#### Elements of Version 1:
- Uses jQuery Autocorrect library/API and contains an array of potential search terms in memory
- Makes a call to Google Maps once search term has been selected in order to receive location information and place marker on map
- I believe this is a less ideal version than using Google Maps and Places Autocomplete service, which is why Version 2 exists. It is less ideal in that it feels hacky, it requires gumming up browser memory with the contents of a 15k line file, and it is not optimized for queries unlike Google's Autocomplete--all despite the fact that Google's service searches through a range of items far greater than just airports.

#### Functions:

`placeMarkerFrom()` and `placeMarkerTo()`: initiated by selection made from dropdown autocomplete menu list, or on 'enter' keypress from either input. Closes any previous infowindows (marker labels) and markers present on the map, which allows for multiple searches without refreshing page. Makes a call to Geocoder API to get information about the search term. Adds result to bothLocations object to save latitude and longitude, as well as adds result to LatLngList object. Ensures map view includes marker location, formats marker label, and drops marker on the map. Checks if both points are already on the map and triggers `showNauticalDistance()` if so.

`$("#pac-input-from").autocomplete({})` and `$("#pac-input-to").autocomplete({})`: the listeners/triggers for jQuery autocomplete service. Handle calling `placeMarkerFrom()` and `placeMarkerTo()` if user makes a selection from menu by clicking or selecting via up/down arrows.

`distance()`: an algorithm developed by [GeoDataSource](http://www.geodatasource.com/developers/javascript), taking two sets of latitude and longitude coordinates and returning nautical distance between them.

`showNauticalDistance()`: takes both locations, triggers `distance()`, appends result to DOM. Uses location coordinates to create new Polyline, append to DOM, and remove any previous Polylines.

`initMap()`: triggered on page load/refresh. Initializes the Google map, creates LatLngList array to allow map to stretch to cover both searched points, creates initial markers, listens for keydown on input and triggers `placeMarkerFrom()` and `placeMarkerTo()` if user inputs search query without using autocomplete.


#### Program flow:

1. On/during pageload: `airportEntries` data in `src/usa-airports.js` is loaded into memory. `initMap()` is called from the script in `index.html`.
2. On user input, jQuery's Autocomplete library/service is triggered, showing a drop-down menu of potential matches. User selects from list by clicking or via up/down arrows, or by pressing 'enter' on their own inputted search term, sees a marker drop onto the map to mark their search result.
3. Once user submits both inputs, map boundaries stretch to cover both points. Additionally, `showNauticalDistance()` is triggered, which calls `distance()` with both sets of coordinates to calculate nautical distance, appends result to DOM, and charts the Polyline flight path, deleting any previous Polylines present on the map.

### Version 2 - reliant mainly on Google Maps/Places Autocomplete service
To view: code is on the `working-solution-all-places` git branch.

#### Elements of Version 2:
- Uses Google Maps/Places for the majority of map, search, and autocomplete functions.
