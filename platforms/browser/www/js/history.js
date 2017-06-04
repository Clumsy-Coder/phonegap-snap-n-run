//this javascript used for displaying the history sessions

//global variables
// google map container
var map;
//a map used to get the date given a key.
var listMap = new Map();

window.onload = function()
{
    //generate the list
    generateList();

    $("#historyMenu").show();
    $("#historyList").show();
    $("#historyViewer").hide();
};

// generate a list of sessions
// display the date and sort it in descending order
function generateList()
{
    var tempArray = [];
    store.forEach(function(key, val){
        var curDate = new Date(key);
        tempArray.push(curDate);
    });

    // sort it by date in descending order
    tempArray = tempArray.sort().reverse();
    for(var i = 0, keyId = 0; i < tempArray.length; i++, keyId++)
    {
        var curDate = tempArray[i];
        // map an id to the date of the session
        listMap.set(keyId, curDate);
        // generate the html
        var listTag = "<a class='collection-item'" + " id='" + keyId++ + "' onclick='generateSession(this.id)'>" +
                        curDate.toDateString() + " " + curDate.toLocaleTimeString() +
                        "<i class='material-icons right'>keyboard_arrow_right</i>" +
                      "</a>";
        $("#historyList").append(listTag);
    }
}

function clearAllHistory()
{
    store.clear();
    listMap.clear();
    $("#historyList").html("");
}

function goToHistoryMenu()
{
    $("#historyMenu").show();
    $("#historyList").show();
    $("#mapContainer").hide();
    $("#historyViewer").hide();
    map = null;
}

// parameter id: corresponds to the key in the listMap
function generateSession(id)
{
    $("#historyMenu").hide();
    $("#historyList").hide();
    $("#historyViewer").show();

    var temp = store.get(listMap.get(parseInt(id)));
    temp = JSON.parse(temp);

    var startLatLng = new google.maps.LatLng(temp.routeArray[0].lat,
                                             temp.routeArray[0].lng);
    var endLatLng = new google.maps.LatLng(temp.routeArray[temp.routeArray.length - 1].lat,
                                           temp.routeArray[temp.routeArray.length - 1].lng);

    // zoom to fit the route taken and display it
    var bounds = new google.maps.LatLngBounds();
    for(var i = 0; i < temp.routeArray.length; i++)
    {
        var curPoint = new google.maps.LatLng(temp.routeArray[i].lat,
                                              temp.routeArray[i].lng);
        bounds.extend(curPoint);
    }

    getSessionMap(bounds);

    // draw the route
    var path = new google.maps.Polyline({
        path: temp.routeArray,
        geodesic: true,
        strokeColor: '#2196f3',
        strokeOpacity: 1.0,
        strokeWeight: 10
    });

    path.setMap(map);

    //update the distance
    var lengthInMeters = google.maps.geometry.spherical.computeLength(path.getPath().getArray());
    var distanceInKiloMeter = lengthInMeters / 1000;
    $("#totalDistance").html(distanceInKiloMeter.toFixed(2) + " km");

    // add the starting and ending marker of the session.
    // to indocate the start and end of a run
    var startMarker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: startLatLng,
        // using font awesome icons, replace the marker icon with a custom icon
        // using https://github.com/nathan-muir/fontawesome-markers
        // stackoverflow post: https://stackoverflow.com/a/17310434/3053548
        icon: {
            path: fontawesome.markers.FLAG,
            scale: 0.5,
            strokeWeight: 0.2,
            strokeColor: "white",
            strokeOpacity: 1,
            fillColor: "green",
            fillOpacity: 0.7
        },
        // place the marker below the image markers
        zIndex: -1
    });

    var endMarker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: endLatLng,
        // using font awesome icons, replace the marker icon with a custom icon
        // using https://github.com/nathan-muir/fontawesome-markers
        // stackoverflow post: https://stackoverflow.com/a/17310434/3053548
        icon: {
            path: fontawesome.markers.FLAG_CHECKERED,
            scale: 0.5,
            strokeWeight: 0.2,
            strokeColor: "black",
            strokeOpacity: 1,
            fillColor: "black",
            fillOpacity: 0.7
        },
        // place the marker below the image markers
        zIndex: -1
    });

    addSessionPicMarkers(id);

}

function addSessionPicMarkers(id)
{
    var temp = store.get(listMap.get(parseInt(id)));
    temp = JSON.parse(temp);

    // used as a reference when an action listener is triggered.
    var markers = [];

    for(var i = 0; i < temp.picArray.length; i++)
    {
        var imageMarkerOpts =
        {
            id: i,       //this will be used for getting the image in picArray
            map: map,
            animation: google.maps.Animation.DROP,
            position: {lat: temp.picArray[i].latitude, lng: temp.picArray[i].longitude},
            label: {
                fontFamily: "Material Icons",
                text: "camera_alt",
                color: "white",
                labelOrigin: new google.maps.Point(40,33)
            },
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(32,65),
        };

        // create the image marker and add a action listener to it
        markers[i] = new google.maps.Marker(imageMarkerOpts);
        google.maps.event.addListener(markers[i], "click", function(){

            // view the image
            $("#viewImgModal").modal({
                                        dismissible: true,
                                        startingTop: '2%', // Starting top style attribute
                                        endingTop: '2%'}); // Ending top style attribute});

            $("#viewImg").attr("src", temp.picArray[this.id].imagePath);
            $("#viewImg").width($("#viewImgModal").width() - 2*24);
            $("#viewImg").css("margin-right", "24px");

            var delta = $(window).height() - ($(window).height() * 0.02) - (1.5*24);
            $("#viewImgModal").css("max-height", delta);
            $("#viewImgModal").modal("open");

        });
    }
}
