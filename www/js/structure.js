//global var
var Latitude = undefined;
var Longitude = undefined;

//used for GPS tracking when there's a change in coordinates
//used in structure.js and googleMaps.js
var watchID = undefined;
//flag for recording GPS coordinates.
//true = records route, false = don't record route
//used in structure.js and googleMaps.js
var watchUser = false;
//google maps marker.
//used in googleMaps.js
var mainMapMarker = undefined;
//google maps div tag
//used in googleMaps.js
var map = undefined;
//route object declaration
var routeObj = null;

//Snap n' run functions
window.onload = function()
{
    $("body").css("background", "#2196f3");
    watchID = watchMapPosition();
    //init routeObject
    routeObj = new RouteObject();

};

function stopRecording()
{
    navigator.geolocation.clearWatch(watchID);
    //store routeObject
    var curTime = new Date();
    store.set(curTime, JSON.stringify(routeObj));
    window.location.replace("index.html");
}

function takePhoto()
{
    var cameraOpts =
    {
        quality: 100,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.PNG,
        cameraDirection: Camera.Direction.FRONT,
        destinationType: Camera.DestinationType.FILE_URI
    };

    navigator.camera.getPicture(onCameraSuccess, onCameraError, cameraOpts);

    function onCameraSuccess(imageData)
    {
        navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, geoOpts);
        function onGeoSuccess(position)
        {
            var pictureO = new pictureObject(position.coords.latitude,
                                             position.coords.longitude,
                                             imageData);

            //call addPic from route.js
            //assuming routeObj is NOT null
            addPic(pictureO);

            //add a marker to google maps
            var imageMarkerOpts =
            {
                id: routeObj.picArray.length - 1,       //this will be used for getting the image in picArray
                map: map,
                animation: google.maps.Animation.DROP,
                position: {lat: position.coords.latitude, lng: position.coords.longitude},
                icon: {url: "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png"}
            };
            var imageMarker = new google.maps.Marker(imageMarkerOpts);
            // google.maps.event.addListener(imageMarker, 'click', getPhoto(imageMarker));

            imageMarker.addListener("click", function(){

                $("#viewImgModal").modal({
                                            dismissible: true,
                                            startingTop: '2%', // Starting top style attribute
                                            endingTop: '2%'}); // Ending top style attribute});

                $("#viewImg").attr("src", routeObj.picArray[imageMarker.id].imagePath);
                $("#viewImg").width($("#viewImgModal").width() - 2*24);
                $("#viewImg").css("margin-right", "24px");

                var delta = $(window).height() - ($(window).height() * 0.02) - (1.5*24);
                $("#viewImgModal").css("max-height", delta);
                $("#viewImgModal").modal("open");

            });
        }
        function onGeoError(error)
        {
            console.log("takePhoto(): Error: unable to get GPS coordinates");
            navigator.notification.alert("Error: unable to retrieve GPS coordinates for picture: \n" + error);
        }
    }

    function onCameraError(message)
    {
        navigator.notification.alert("Error. Unable to get picture: \n" + message);
    }
}
