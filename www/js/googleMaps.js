//Google Maps API code
//obtained from https://github.com/apache/cordova-plugin-geolocation

var geoOpts =
{
    enableHighAccuracy: true
};

//get the coordinates
function getMapLocation()
{
    //set the height of the map for the device
    // $("#mapContainer").css("height", window.innerHeight + "px");
    navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, geoOpts);
}

//success callback for geolocation coordinates
var onMapSuccess = function(position)
{
    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;
    // navigator.notification.alert("Coordinates recieved: \nLatitude: " + Latitude + "\nLongitude: " + Longitude);
    getMap(Latitude, Longitude);
    // console.log("Map created");
    addRoute(Latitude, Longitude);
    drawRoute();

};

//get the map using the coordinates
function getMap(latitude, longitude)
{
    var mapOpts =
    {
        center: new google.maps.LatLng(0,0),
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        // disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true
    };

    var height = $("#toolbar").height();
    var totalHeight = $(window).height() - height - (1.6 * 18);
    $("#mapContainer").css("height", totalHeight + "px");

    map = new google.maps.Map(document.getElementById("mapContainer"), mapOpts);

    var latLong = new google.maps.LatLng(Latitude, Longitude);
    var markerOpts =
    {
        animation: google.maps.Animation.DROP,
        position: latLong,
        map: map,
    };
    mainMapMarker = new google.maps.Marker(markerOpts);

    mainMapMarker.setMap(map);
    // map.setZoom(20);
    map.setCenter(mainMapMarker.getPosition());
}

// Success callback for watching your changing position
var onMapWatchSuccess = function (position) {

    var updatedLatitude = position.coords.latitude;
    var updatedLongitude = position.coords.longitude;

    if (updatedLatitude != Latitude && updatedLongitude != Longitude) {

        Latitude = updatedLatitude;
        Longitude = updatedLongitude;

        //check if the user wants to have the route mapped.
            // add the coordinates to the route array
        var latLong = new google.maps.LatLng(updatedLatitude, updatedLongitude);
        mainMapMarker.setPosition(latLong);
        mainMapMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
        map.panTo(latLong);

        addRoute(updatedLatitude, updatedLongitude);
        drawRoute();
    }
};

// Error callback
function onMapError(error) {
    console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    // navigator.notification.alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}

// Watch your changing position

function watchMapPosition() {

    getMapLocation();
    return navigator.geolocation.watchPosition(onMapWatchSuccess, onMapError, geoOpts);
}

// only used in history.js
function getSessionMap(polyLineBounds)
{
    var mapOpts =
    {
        center: new google.maps.LatLng(0,0),
        // zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        // disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true
    };
    var height = $("#historyViewer").height();
    $("#mapContainer").show();

    var totalHeight = $(window).height() - height - (1.6 * 18);
    $("#mapContainer").css("height", totalHeight + "px");

    map = new google.maps.Map(document.getElementById("mapContainer"), mapOpts);
    map.fitBounds(polyLineBounds);

}
