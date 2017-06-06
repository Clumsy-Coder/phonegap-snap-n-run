// javascript file used for defining the
// pictureObject : used for storing GPS coordinates and path to the picture
// routeObject : used for plotting the path the user took from point A to B.
//      also used for keeping track of the pictureObject of that run

//picture object used for defining the path of the image and coordinates
//where the image was taken
function pictureObject(latCoor, longCoor, imageDir)
{
    //contains the path to the image
    //contains the lat and long on where the image was taken
    this.latitude = latCoor;
    this.longitude = longCoor;
    this.imagePath = imageDir;
}

//route object used for plotting the path the user took from point A to B
// var RouteObject =
function RouteObject()
{
    //contains an array of pictureObject;
    this.picArray = [];
    //contains the latitude and longitude of the path the user walked/ran on.
    this.routeArray = [];
}

//ONLY used for routeObject
//function to append the pictureObject.
function addPic(pictureO)
{
    routeObj.picArray.push(pictureO);
}

function addRoute(latCoor, longCoor)
{
    var latLong = new google.maps.LatLng(latCoor, longCoor);
    routeObj.routeArray.push(latLong);
}

function drawRoute()
{
    var path = new google.maps.Polyline({
        path: routeObj.routeArray,
        geodesic: true,
        strokeColor: '#2196f3',
        strokeOpacity: 1.0,
        strokeWeight: 10
    });

    path.setMap(map);
    //update the distance
    var lengthInMeters = google.maps.geometry.spherical.computeLength(path.getPath());
    var distanceInKiloMeter = lengthInMeters / 1000;
    $("#totalDistance").html(distanceInKiloMeter.toFixed(2) + " km");
}
