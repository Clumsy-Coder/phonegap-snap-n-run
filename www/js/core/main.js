// contains the main logic of the application
// used when recording the session.

let watchID = null;			// contains the ID of watching changes in GPS coords.
let curSession = null;		// an instance of sessionRoute
let sessionMaps = null;		// an instance of googleMaps

// extra info when using the GPS
const geoOpts = {
	enableHighAccuracy: true
};

window.onload = function(){
	init();
};// END FUNCTION window.onload()

// loads the sessionRoute and googleMaps.
function init(){
	// init sessionRoute and googleMaps
	// get the current location
	// 		stop the loading spinner
	// 		set the height of the google maps canvas
	// 		load googleMaps canvas
	// 		add the current location to sessionRoute
	// 		draw the route
	// start watching for GPS changes

	curSession = new sessionRoute();
	sessionMaps = new googleMaps(document.getElementById("mapContainer"));

	navigator.geolocation.getCurrentPosition(
		(position) => {
			const height = $("#toolbar").height();
			const totalHeight = $(window).height() - height - (1.6 * 18);
			// loading spinner
			document.getElementById("spinner").style.width = $(window).width();
			document.getElementById("spinner").style.left = totalHeight;

			sessionMaps.mapContainer.style.height = totalHeight + "px";
			sessionMaps.loadMaps(position.coords.latitude, position.coords.longitude);
			document.getElementById("spinner").style.display = "none";

			curSession.addRoute(position.coords.latitude, position.coords.longitude);
			sessionMaps.drawRoute(curSession.routes);
		},
		(error) => console.log(`unable to get GPS location \n${error.code}\n${error.message}`),
		geoOpts
	);
	// watch for the GPS changes.
	watchID = navigator.geolocation.watchPosition(onMapWatchSuccess, onMapWatchError, geoOpts);
}// END FUNCTION init()

// stop listening to GPS changes and saves the sessionRoute data
function stopRecording(){
	navigator.geolocation.clearWatch(watchID);
	const exportData = curSession.export();
	store.set(new Date(), curSession.export());
	window.location.replace("index.html");
}// END FUNCTION stopRecording()

// when there's a change in GPS location
function onMapWatchSuccess(position){
	// save the coords into google.maps.LatLng
	// get the last GPS coords
	// get the absolute difference between the previous GPS coords and the current once
	// check if the difference exceeds a certain threshold
	//		if exceeds
	// 		move the main google maps marker to the new coords
	// 		move the map to the new coords
	// 		add the GPS coords to sessionRoute
	// 		draw the route

	const newCoords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

	const lastCoords = curSession.routes[curSession.routes.length - 1];
	const deltaLat = Math.abs(newCoords.lat() - lastCoords.lat);
	const deltaLng = Math.abs(newCoords.lng() - lastCoords.lng);

	const latPrecision = 0.00001;
	const lngPrecision = 0.00001;

	if(deltaLat > latPrecision || deltaLng > lngPrecision){
		sessionMaps.mainMarker.setPosition(newCoords);
		// main marker always on top
		sessionMaps.mainMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
		sessionMaps.mapCanvas.panTo(newCoords);

		curSession.addRoute(position.coords.latitude, position.coords.longitude);
		sessionMaps.drawRoute(curSession.routes);
	}
}// END FUNCTION onMapWatchSuccess(position)

// occurs when the app is unable to get GPS coordinates during the GPS watch
function onMapWatchError(error){
	console.log(`code: ${error.code}
				 message: ${error.message}`);
}// END FUNCTION onMapWatchError(error)

// process for taking a picture.
function takePhoto(){
	// get the current location
	// get the picture
	// add an image marker on google maps
	getLocation().then((position) => getPicture(position)).catch(onGeoError);
}// END FUNCTION takePhoto()

// get the current GPS coords and return it
function getLocation(){
	return new Promise(function(resolve, reject){
		navigator.geolocation.getCurrentPosition(resolve, reject, geoOpts);
	});
}// END FUNCTION getLocation()

// get the picture, add it to sessionRoute and add an image marker
function getPicture(coordinates){
	// get the picture
	// add the image to sessionRoute
	// add the image marker on google maps
	const cameraOpts = {
		quality: 100,
		sourceType: Camera.PictureSourceType.CAMERA,
		encodingType: Camera.EncodingType.PNG,
		cameraDirection: Camera.Direction.FRONT,
		destinationType: Camera.DestinationType.FILE_URI
	};

	navigator.camera.getPicture((imageData) => {
		curSession.addPic(coordinates.coords.latitude, coordinates.coords.longitude, imageData);
		const imgMarkerOpts = {
			id: curSession.pics.length - 1,       //this will be used for getting the image in picArray
			map: sessionMaps.mapCanvas,
			animation: google.maps.Animation.DROP,
			position: {lat: coordinates.coords.latitude, lng: coordinates.coords.longitude},
			icon: {url: "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png"}
		};
		sessionMaps.addImgMarker(coordinates, imageData, imgMarkerOpts);
	}, onCameraError, cameraOpts);
}// END FUNCTION getPicture(coordinates)

// occurs when the app is unable to get a GPS coordinates when taking a picture
function onGeoError(error){
	console.log(`takePhoto() error: unable to get GPS coordinates\n${error}`);
	navigator.notification.alert(`Error: unable to retrieve GPS coordinates for picture\n${error}`);
}// END FUNCTION onGeoError(error)

// occures when the app is unable to get the picture
function onCameraError(error){
	console.log(`Error: unable to get picture\n${error}`);
	navigator.notification.alert(`Error: unable to get picture\n${error}`)
}// END FUNCTION onCameraError(error)
